export interface GameDataItem {
  itemId: string;
  name: string;
  classifyType: string;
  sortId: number;
  buildingProductList: Array<{
    roomType: string;
    formulaId: string;
  }>;
  rarity: number; // 0-indexed
  [otherProperties: string]: unknown;
}

export interface GameDataCost {
  id: string;
  count: number;
}

export interface GameDataCharacter {
  name: string;
  appellation: string;
  isNotObtainable: boolean;
  profession: string;
  allSkillLvlUp: Array<{
    lvlUpCost: GameDataCost[];
  }>;
  skills: Array<{
    skillId: string;
    levelUpCostCond: Array<{
      levelUpCost: GameDataCost[];
    }>;
  }>;
  [otherProperties: string]: unknown;
}
