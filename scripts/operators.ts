import fs from "fs";
import path from "path";

import enCharacterTable from "./ArknightsGameData/en_US/gamedata/excel/character_table.json";
import enSkillTable from "./ArknightsGameData/en_US/gamedata/excel/skill_table.json";
import cnCharacterTable from "./ArknightsGameData/zh_CN/gamedata/excel/character_table.json";
import cnSkillTable from "./ArknightsGameData/zh_CN/gamedata/excel/skill_table.json";
import { Ingredient } from "./output-types";
import { DATA_OUTPUT_DIRECTORY } from "./shared";

const enSkills: { [skillId: string]: GameDataSkill } = enSkillTable;
const cnSkills: { [skillId: string]: GameDataSkill } = cnSkillTable;
const enCharacters = enCharacterTable as {
  [charId: string]: GameDataCharacter;
};
const cnCharacters = cnCharacterTable as {
  [charId: string]: GameDataCharacter;
};

interface GameDataCharacter {
  name: string;
  isNotObtainable: boolean;
  profession: string;
  [otherProperties: string]: unknown;
}

interface GameDataSkill {
  skillId: string;
  iconId: string | null;
  [otherProperties: string]: unknown;
}

enum OperatorGoalCategory {
  Elite = 0,
  Mastery,
  SkillLevel,
  Module,
}

interface OperatorGoal {
  type: "OPERATOR";
  name: string;
  category: OperatorGoalCategory;
  ingredients: Ingredient[];
}

interface SkillLevelGoal extends OperatorGoal {
  category: OperatorGoalCategory.SkillLevel;
  skillLevel: number;
}

interface EliteGoal extends OperatorGoal {
  category: OperatorGoalCategory.Elite;
  eliteLevel: number;
}

interface MasteryGoal extends OperatorGoal {
  category: OperatorGoalCategory.Mastery;
  masteryLevel: number;
}

interface ModuleGoal extends OperatorGoal {
  category: OperatorGoalCategory.Module;
}

interface Operator {
  id: string;
  name: string;
  rarity: number;
  class: string;
  branch: string;
  skillLevels: SkillLevelGoal[];
  elite: EliteGoal[];
  skills: Array<{
    skillId: string;
    iconId: string | null;
    skillName: string;
    masteries: MasteryGoal[];
  }>;
  module?: ModuleGoal;
}

const isOperator = (charId: string) => {
  const entry = cnCharacters[charId];
  return (
    entry.profession !== "TOKEN" &&
    entry.profession !== "TRAP" &&
    !entry.isNotObtainable
  );
};

const isSummon = (charId: string) => {
  const entry = cnCharacters[charId];
  return entry.profession === "TOKEN";
};

(() => {
  const enOperators = {};
  const cnOperators = {};
  const operatorsJson = { ...cnOperators, ...enOperators };

  fs.writeFileSync(
    path.join(DATA_OUTPUT_DIRECTORY, "operators.json"),
    JSON.stringify(operatorsJson, null, 2)
  );
})();
