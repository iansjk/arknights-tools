export interface Item {
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

export interface Cost {
  id: string;
  count: number;
}

export interface Character {
  name: string;
  appellation: string;
  isNotObtainable: boolean;
  profession: string;
  rarity: number; // 0-indexed
  allSkillLvlup: Array<{
    lvlUpCost: Cost[] | null;
  }>;
  phases: Array<{
    evolveCost: Cost[] | null;
  }>;
  skills: Array<{
    skillId: string | null;
    levelUpCostCond: Array<{
      levelUpCost: Cost[] | null;
    }>;
  }>;
  [otherProperties: string]: unknown;
}

export interface CharacterCN extends Character {
  subProfessionId: string;
}

export interface Formula {
  goldCost?: number;
  count: number;
  costs: Cost[];
  formulaType: string;
}

export interface Module {
  uniEquipName: string;
  charId: string;
  type: string;
  itemCost: Cost[] | null;
}

export interface Skill {
  skillId: string;
  iconId: string | null;
  levels: Array<{
    name: string;
  }>;
  [otherProperties: string]: unknown;
}
