interface BaseItem {
  id: string;
  name: string;
  tier: number;
  sortId: number;
}

export interface Ingredient extends BaseItem {
  quantity: number;
}

export interface OutputItem extends BaseItem {
  quantity?: number;
  ingredients?: Ingredient[];
}
