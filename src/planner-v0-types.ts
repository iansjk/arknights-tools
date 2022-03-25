export enum OperatorGoalCategory {
  Elite = 0,
  Mastery,
  SkillLevel,
}

export type OperatorGoals = OperatorGoal[];

interface BaseGoal {
  operatorName: string;
  goalCategory: OperatorGoalCategory;
}

interface EliteGoal extends BaseGoal {
  goalCategory: OperatorGoalCategory.Elite;
  eliteLevel: number;
}

interface MasteryGoal extends BaseGoal {
  goalCategory: OperatorGoalCategory.Mastery;
  masteryLevel: number;
  skill: {
    skillId: string;
  };
}

interface SkillLevelGoal extends BaseGoal {
  goalCategory: OperatorGoalCategory.SkillLevel;
  skillLevel: number;
}

export type OperatorGoal = EliteGoal | MasteryGoal | SkillLevelGoal;

export interface ItemsToCraft {
  [itemName: string]: unknown; // actually an ItemV0, but we don't care
}

export interface MaterialsOwned {
  [itemName: string]: number;
}
