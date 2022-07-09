export interface Item {
  id: string;
  name: string;
  tier: number;
  sortId: number;
  iconId: string;
  yield?: number;
  ingredients?: Ingredient[];
  stages?: {
    leastSanity?: StageData;
    mostEfficient?: StageData;
  };
}

export interface Ingredient {
  id: string;
  quantity: number;
}

export interface StageData {
  stageSanityCost: number;
  stageName: string;
  itemSanityCost: number;
  dropRate: number;
}

export enum OperatorGoalCategory {
  Elite = 0,
  Mastery,
  SkillLevel,
  Module,
}

interface BaseOperatorGoal {
  name: string;
  category: OperatorGoalCategory;
  ingredients: Ingredient[];
}

export interface SkillLevelGoal extends BaseOperatorGoal {
  category: OperatorGoalCategory.SkillLevel;
  skillLevel: number;
}

export interface EliteGoal extends BaseOperatorGoal {
  category: OperatorGoalCategory.Elite;
  eliteLevel: number;
}

export interface MasteryGoal extends BaseOperatorGoal {
  category: OperatorGoalCategory.Mastery;
  masteryLevel: number;
}

export interface ModuleGoal extends BaseOperatorGoal {
  category: OperatorGoalCategory.Module;
  moduleLevel: number;
}

export type OperatorGoal =
  | SkillLevelGoal
  | MasteryGoal
  | ModuleGoal
  | EliteGoal;

export interface Skill {
  skillId: string;
  iconId: string | null;
  skillName: string;
  masteries: MasteryGoal[];
}

export interface Module {
  moduleName: string;
  moduleId: string;
  typeName: string;
  masteries: ModuleGoal[];
}

export interface Operator {
  id: string;
  name: string;
  rarity: number;
  class: string;
  branch: string;
  isCnOnly: boolean;
  skillLevels: SkillLevelGoal[];
  elite: EliteGoal[];
  skills: Skill[];
  module?: Module[];
}

export interface RecruitableOperator {
  id: string;
  name: string;
  rarity: number;
  tags: string[];
}

export interface RecruitmentResult {
  tags: string[];
  operators: RecruitableOperator[];
  guarantees: number[];
}
