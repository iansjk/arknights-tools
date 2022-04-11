import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { Combination, Permutation } from "js-combinatorics";

import characterTable from "./ArknightsGameData/en_US/gamedata/excel/character_table.json" assert { type: "json" };
import gachaTable from "./ArknightsGameData/en_US/gamedata/excel/gacha_table.json" assert { type: "json" };
import {
  DATA_OUTPUT_DIRECTORY,
  professionToClass,
  toTitleCase,
} from "./shared.mjs";

const nameOverrides = {
  "THRM-EX": "Thermal-EX",
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

const recruitDetail = gachaTable.recruitDetail;

const createRecruitmentJson = () => {
  const operatorNameToId = Object.fromEntries(
    Object.entries(characterTable).map(([id, opData]) => [opData.name, id])
  );

  const recruitMessageHeader =
    "<@rc.title>Recruitment Rules</>\n\n<@rc.em>Only when you choose this tag can you have a chance to obtain a ★★★★★★ Operator</>\n<@rc.em>Top Operator</>\n\n<@rc.subtitle>※All Possible Operators※</>\n<@rc.eml>Operators displayed in green cannot be obtained through Headhunting. You can get them through Recruitment</>\n\n";
  const recruitmentStrings = recruitDetail
    .replace(recruitMessageHeader, "")
    .split(/★+/);
  const recruitableOperators = recruitmentStrings.map((line) =>
    line
      .replace(/\n|-{2,}/g, "")
      .split(/(?:\s\/\s)|(?:<@rc\.eml>([^/]+)<\/>)/)
      .filter((item) => !!item && item.trim())
  );

  /** @type{Array<{id: string, name: string, rarity: number, tags: string[]}>} */
  const recruitment = recruitableOperators.flatMap((opNames, rarity) =>
    opNames
      .filter((name) => !!name)
      .map((opName) => {
        const opId = operatorNameToId[opName];
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
  const regularRecruitmentResults = Object.fromEntries(
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

  const misereRecruitmentResults = Object.fromEntries(
    [...new Permutation(RECRUITMENT_TAGS, 2)]
      .filter(([wantToStick, wantToDrop]) => {
        const stickTagResults = regularRecruitmentResults[wantToStick];
        const dropTagResults = regularRecruitmentResults[wantToDrop];
        return (
          (!stickTagResults ||
            !stickTagResults.guarantees.some(
              (rarity) => rarity === 1 || rarity >= 4
            )) &&
          (!dropTagResults ||
            !dropTagResults.guarantees.some(
              (rarity) => rarity === 1 || rarity >= 4
            ))
        );
      })
      .map(([wantToStick, wantToDrop]) => {
        const operators = recruitment.filter((recruitable) => {
          return (
            recruitable.tags.includes(wantToStick) &&
            !recruitable.tags.includes(wantToDrop)
          );
        });

        if (operators.length === 0) {
          return null;
        }

        const lowestRarity = Math.min(
          ...operators.filter((op) => op.rarity !== 1).map((op) => op.rarity)
        );
        const guarantees = [];
        if (lowestRarity >= 4) {
          for (let i = lowestRarity; i <= lowestRarity; i++) {
            guarantees.push(i);
          }
        }
        if (operators.find((op) => op.rarity === 1) && lowestRarity >= 5) {
          guarantees.push(1);
        }

        return guarantees.length === 0
          ? null
          : {
              wantToStick,
              wantToDrop,
              operators,
              guarantees,
            };
      })
      .filter((result) => Boolean(result))
      .map((result) => [
        `${result.wantToStick}--${result.wantToDrop}--`,
        result,
      ])
  );

  const outPath = path.join(DATA_OUTPUT_DIRECTORY, "recruitment.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        regularRecruitmentResults,
        misereRecruitmentResults,
      },
      null,
      2
    )
  );
  console.log(`recruitment: wrote ${outPath}`);
};

export default createRecruitmentJson;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createRecruitmentJson();
}
