interface BaseItem {
  id: string;
  name: string;
  tier: number;
  sortId: number;
}

export interface Ingredient extends BaseItem {
  quantity: number;
}

export interface Item extends BaseItem {
  quantity?: number;
  ingredients?: Ingredient[];
}

export enum OperatorGoalCategory {
  Elite = 0,
  Mastery,
  SkillLevel,
  Module,
}

interface OperatorGoal {
  name: string;
  category: OperatorGoalCategory;
  ingredients: Ingredient[];
}

export interface SkillLevelGoal extends OperatorGoal {
  category: OperatorGoalCategory.SkillLevel;
  skillLevel: number;
}

export interface EliteGoal extends OperatorGoal {
  category: OperatorGoalCategory.Elite;
  eliteLevel: number;
}

export interface MasteryGoal extends OperatorGoal {
  category: OperatorGoalCategory.Mastery;
  masteryLevel: number;
}

export interface ModuleGoal extends OperatorGoal {
  category: OperatorGoalCategory.Module;
}

export interface Skill {
  skillId: string;
  iconId: string | null;
  skillName: string;
  masteries: MasteryGoal[];
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
  module?: ModuleGoal;
}
