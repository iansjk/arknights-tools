import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { completeGoal } from "./goalsActions";
import type { RootState } from "./store";

interface SetStockPayload {
  itemId: string;
  newQuantity: number;
}

export interface DepotState {
  stock: { [itemId: string]: number };
  crafting: { [itemId: string]: boolean };
}

const initialState: DepotState = {
  stock: {},
  crafting: {},
};

export const depotSlice = createSlice({
  name: "depot",
  initialState,
  reducers: {
    decrement: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.stock[itemId] = Math.max((state.stock[itemId] ?? 0) - 1, 0);
    },
    increment: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.stock[itemId] = (state.stock[itemId] ?? 0) + 1;
    },
    setStock: (state, action: PayloadAction<SetStockPayload>) => {
      const { itemId, newQuantity } = action.payload;
      state.stock[itemId] = newQuantity;
    },
    toggleCrafting: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.crafting[itemId] = !state.crafting[itemId];
    },
    craftOneWithStock: (_state, _action: PayloadAction<string>) => {
      throw new Error("Not yet implemented");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(completeGoal, (_state, _action) => {
      throw new Error("Not yet implemented");
    });
  },
});

export const selectStock = (state: RootState) => state.depot.stock;
export const selectCrafting = (state: RootState) => state.depot.crafting;

export const {
  decrement,
  increment,
  setStock,
  toggleCrafting,
  craftOneWithStock,
} = depotSlice.actions;

export default depotSlice.reducer;
