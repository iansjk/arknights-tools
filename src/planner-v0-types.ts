export enum OperatorGoalCategory {
  Elite = 0,
  Mastery,
  SkillLevel,
}

export type OperatorGoals = Array<{
  operatorName: string;
  goalCategory: OperatorGoalCategory;
  ingredients: Array<{
    name: string;
    quantity: number;
  }>;
}>;

export interface ItemsToCraft {
  [itemName: string]: unknown; // actually an ItemV0, but we don't care
}

export interface MaterialsOwned {
  [itemName: string]: number;
}
