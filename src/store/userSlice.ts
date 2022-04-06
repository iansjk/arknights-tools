import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "./store";

export enum UserPreference {
  PLANNER_SORT_COMPLETE_ITEMS_TO_BOTTOM = "PLANNER_SORT_COMPLETE_ITEMS_TO_BOTTOM",
  HIDE_INCREMENT_DECREMENT_BUTTONS = "SHOW_INCREMENT_DECREMENT_BUTTONS",
}

export interface UserState {
  preferences: { [preference: string]: boolean };
}

const initialState: UserState = {
  preferences: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setPreference: (
      state,
      action: PayloadAction<{ preference: UserPreference; value: boolean }>
    ) => {
      const { preference, value } = action.payload;
      state.preferences[preference] = value;
    },
  },
});

export const selectPreference = createSelector(
  [
    (state: RootState) => state.user.preferences,
    (_state: RootState, preferenceKey: UserPreference) => preferenceKey,
  ],
  (preferences, preferenceKey) => preferences[preferenceKey]
);

export const { setPreference } = userSlice.actions;

export default userSlice.reducer;
