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
  rarity: number; // 0-indexed
  allSkillLvlup: Array<{
    lvlUpCost: GameDataCost[] | null;
  }>;
  phases: Array<{
    evolveCost: GameDataCost[] | null;
  }>;
  skills: Array<{
    skillId: string | null;
    levelUpCostCond: Array<{
      levelUpCost: GameDataCost[] | null;
    }>;
  }>;
  [otherProperties: string]: unknown;
}

export interface GameDataCharacterCN extends GameDataCharacter {
  subProfessionId: string;
}
