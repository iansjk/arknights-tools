import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { Combination } from "js-combinatorics";

import characterTable from "./ArknightsGameData/en_US/gamedata/excel/character_table.json" assert { type: "json" };
import gachaTable from "./ArknightsGameData/en_US/gamedata/excel/gacha_table.json" assert { type: "json" };
import {
  DATA_OUTPUT_DIRECTORY,
  professionToClass,
  toTitleCase,
} from "./shared.mjs";

/**
 * Unfortunately Justice Knight is missing the single quotes in the list of recruitable operators,
 * so we'll have to manually map the name to char id
 */
const recruitableNameToIdOverride = {
  "Justice Knight": "char_4000_jnight",
};

const nameOverrides = {
  "THRM-EX": "Thermal-EX",
  "Justice Knight": "'Justice Knight'",
};

const RECRUITMENT_TAGS = [
  "Top Operator",
  "Senior Operator",
  "Starter",
  "Robot",
  "Melee",
  "Ranged",
  "Caster",
  "Defender",
  "Guard",
  "Medic",
  "Sniper",
  "Specialist",
  "Supporter",
  "Vanguard",
  "AoE",
  "Crowd-Control",
  "DP-Recovery",
  "DPS",
  "Debuff",
  "Defense",
  "Fast-Redeploy",
  "Healing",
  "Nuker",
  "Shift",
  "Slow",
  "Summon",
  "Support",
  "Survival",
];

const { recruitDetail } = gachaTable;

const createRecruitmentJson = () => {
  const operatorNameToId = Object.fromEntries(
    Object.entries(characterTable).map(([id, opData]) => [opData.name, id])
  );

  const recruitMessageHeader =
    "<@rc.title>Recruitment Rules</>\n\n<@rc.em>※Rare recruitment tag rules※</>\n<@rc.em>When the Top Operator tag is chosen and the recruitment time is set to 9 hours, a 6-star operator is guaranteed</>\n<@rc.em>When the Senior Operator tag is chosen and the recruitment time is set to 9 hours, a 5-star operator is guaranteed</>\n\n<@rc.subtitle>※All Possible Operators※</>\n<@rc.eml>Operators displayed in green cannot be obtained through Headhunting. You can get them through Recruitment</>\n\n";
  const recruitmentStrings = recruitDetail
    .replace(recruitMessageHeader, "")
    .split(/★+/);
  const recruitableOperators = recruitmentStrings.map((line) =>
    line
      .replace(/\n|-{2,}/g, "")
      .split(/(?:\s\/\s)|(?:<@rc\.eml>([^/]+)<\/>)/)
      .filter((item) => !!item && item.trim())
  );

  const recruitment = recruitableOperators.flatMap((opNames, rarity) =>
    opNames
      .filter((name) => !!name)
      .map((opName) => {
        const opId =
          recruitableNameToIdOverride[opName] ?? operatorNameToId[opName];
        const opData = characterTable[opId];
        const tags = [
          ...(opData.tagList ?? []),
          toTitleCase(opData.position),
          professionToClass(opData.profession),
        ];
        if (rarity === 1) {
          tags.push("Robot");
        } else if (rarity === 6) {
          tags.push("Top Operator");
        }
        if (rarity >= 5) {
          tags.push("Senior Operator");
        }
        return {
          id: opId,
          name: nameOverrides[opName] ?? opName,
          rarity,
          tags,
        };
      })
  );

  const tagSets = Array(3)
    .fill(0)
    .flatMap((_, i) => [...new Combination(RECRUITMENT_TAGS, i + 1)]);
  const recruitmentResults = Object.fromEntries(
    tagSets
      .map((tagSet) => ({
        tags: tagSet.sort(),
        operators: recruitment
          .filter((recruitable) =>
            tagSet.every(
              (tag) =>
                recruitable.tags.includes(tag) &&
                (recruitable.rarity < 6 || tagSet.includes("Top Operator"))
            )
          )
          .sort((op1, op2) => op2.rarity - op1.rarity),
      }))
      .filter((recruitData) => recruitData.operators.length > 0)
      .map((result) => {
        // for guaranteed tags, we only care about 1*, 4*, 5*, and 6*.
        // we include 1* if
        // - the otherwise highest rarity is 5 (1* and 5* can't coexist), or
        // - the Robot tag is available
        const lowestRarity = Math.min(
          ...result.operators
            .map((op) => op.rarity)
            .filter((rarity) => rarity > 1)
        );
        if (lowestRarity > 1 && lowestRarity < 4) {
          return [
            result.tags,
            {
              ...result,
              guarantees: [],
            },
          ];
        }

        const guarantees = Number.isFinite(lowestRarity) ? [lowestRarity] : [];
        if (
          (result.operators.find((op) => op.rarity === 1) &&
            lowestRarity >= 5) ||
          result.tags.includes("Robot")
        ) {
          guarantees.push(1);
        }
        return [
          result.tags,
          {
            ...result,
            guarantees,
          },
        ];
      })
  );
  const outPath = path.join(DATA_OUTPUT_DIRECTORY, "recruitment.json");
  fs.writeFileSync(outPath, JSON.stringify(recruitmentResults, null, 2));
  console.log(`recruitment: wrote ${outPath}`);
};

export default createRecruitmentJson;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createRecruitmentJson();
}
