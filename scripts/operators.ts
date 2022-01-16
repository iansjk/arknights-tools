import fs from "fs";
import path from "path";

import enCharacterPatchTable from "./ArknightsGameData/en_US/gamedata/excel/char_patch_table.json";
import enCharacterTable from "./ArknightsGameData/en_US/gamedata/excel/character_table.json";
import enSkillTable from "./ArknightsGameData/en_US/gamedata/excel/skill_table.json";
import cnCharacterPatchTable from "./ArknightsGameData/zh_CN/gamedata/excel/char_patch_table.json";
import cnCharacterTable from "./ArknightsGameData/zh_CN/gamedata/excel/character_table.json";
import cnSkillTable from "./ArknightsGameData/zh_CN/gamedata/excel/skill_table.json";
import cnUniequipTable from "./ArknightsGameData/zh_CN/gamedata/excel/uniequip_table.json";
import * as GameData from "./gamedata-types";
import * as Output from "./output-types";
import {
  DATA_OUTPUT_DIRECTORY,
  gameDataCostToIngredient,
  getEliteLMDCost,
  getOperatorName,
  professionToClass,
} from "./shared";

const enSkills: { [skillId: string]: GameData.Skill } = enSkillTable;
const cnSkills: { [skillId: string]: GameData.Skill } = cnSkillTable;
const enCharacters = enCharacterTable as {
  [charId: string]: GameData.Character;
};
const cnCharacters = cnCharacterTable as {
  [charId: string]: GameData.CharacterCN;
};
const enPatchCharacters = enCharacterPatchTable.patchChars as {
  [charId: string]: GameData.Character;
};
const cnPatchCharacters = cnCharacterPatchTable.patchChars as {
  [charId: string]: GameData.CharacterCN;
};
const {
  equipDict,
  charEquip,
}: {
  equipDict: {
    [moduleId: string]: GameData.Module;
  };
  charEquip: {
    [charId: string]: string[];
  };
} = cnUniequipTable;

const isOperator = (charId: string) => {
  const operator = cnCharacters[charId];
  return (
    operator.profession !== "TOKEN" &&
    operator.profession !== "TRAP" &&
    !operator.isNotObtainable
  );
};

const isSummon = (charId: string) => {
  const entry = cnCharacters[charId];
  return entry.profession === "TOKEN";
};

(() => {
  const operatorsJson: { [operatorId: string]: Output.Operator } =
    Object.fromEntries(
      [
        ...Object.entries(cnCharacters).filter(
          // only include operators of rarity 3+, since 1* and 2* operators don't have any goals to add
          ([charId]) => isOperator(charId) && cnCharacters[charId].rarity >= 2
        ),
        ...Object.entries(cnPatchCharacters),
      ].map(([id, operator]) => {
        const rarity = operator.rarity + 1;
        const isCnOnly =
          enCharacters[id] == null && enPatchCharacters[id] == null;
        const isPatchCharacter = cnPatchCharacters[id] != null;

        const skillLevelGoals: Output.SkillLevelGoal[] = isPatchCharacter
          ? []
          : operator.allSkillLvlup
              .filter(({ lvlUpCost }) => lvlUpCost != null)
              .map((skillLevelEntry, i) => {
                const cost = skillLevelEntry.lvlUpCost!;
                const ingredients = cost.map(gameDataCostToIngredient);
                return {
                  // we want to return the result of a skillup,
                  // and since [0] points to skill level 1 -> 2, we add 2
                  skillLevel: i + 2,
                  ingredients,
                  name: `Skill Level ${i + 2}`,
                  category: Output.OperatorGoalCategory.SkillLevel,
                };
              });

        const eliteGoals: Output.EliteGoal[] = isPatchCharacter
          ? []
          : operator.phases
              .filter(({ evolveCost }) => evolveCost != null)
              .map(({ evolveCost }, i) => {
                const ingredients = evolveCost!.map(gameDataCostToIngredient);
                ingredients.unshift(getEliteLMDCost(rarity, i + 1));
                // [0] points to E1, [1] points to E2, so add 1
                return {
                  eliteLevel: i + 1,
                  ingredients,
                  name: `Elite ${i + 1}`,
                  category: Output.OperatorGoalCategory.Elite,
                };
              });

        const skills: Output.Skill[] = operator.skills
          .filter(
            ({ skillId, levelUpCostCond }) =>
              skillId != null &&
              // require that all mastery levels have a levelUpCost defined
              !levelUpCostCond.find(({ levelUpCost }) => levelUpCost == null)
          )
          .map(({ skillId, levelUpCostCond }, i) => {
            const masteries: Output.MasteryGoal[] = levelUpCostCond.map(
              ({ levelUpCost }, j) => {
                const ingredients = levelUpCost!.map(gameDataCostToIngredient);
                return {
                  masteryLevel: j + 1,
                  ingredients,
                  name: `Skill ${i + 1} Mastery ${j + 1}`,
                  category: Output.OperatorGoalCategory.Mastery,
                };
              }
            );

            const skillTable = isCnOnly ? cnSkills : enSkills;
            return {
              skillId: skillId!,
              iconId: skillTable[skillId!].iconId,
              skillName: skillTable[skillId!].levels[0].name,
              masteries,
            };
          });

        let module: Output.ModuleGoal | undefined = undefined;
        if (charEquip[id] != null) {
          const advancedModuleId = charEquip[id].at(-1)!;
          const moduleData = equipDict[advancedModuleId];
          module = {
            name: moduleData.uniEquipName,
            ingredients: moduleData.itemCost!.map(gameDataCostToIngredient),
            category: Output.OperatorGoalCategory.Module,
          };
        }

        const outputOperator = {
          id,
          name: getOperatorName(id),
          rarity,
          class: professionToClass(operator.profession),
          branch: operator.subProfessionId, // TODO
          isCnOnly,
          skillLevels: skillLevelGoals,
          elite: eliteGoals,
          skills,
          module,
        };
        return [id, outputOperator];
      })
    );

  fs.writeFileSync(
    path.join(DATA_OUTPUT_DIRECTORY, "operators.json"),
    JSON.stringify(operatorsJson, null, 2)
  );
})();
