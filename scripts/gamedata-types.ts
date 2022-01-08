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
