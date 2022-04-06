import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum preferenceKeys {
  PLANNER_SORT_COMPLETE_ITEMS_TO_BOTTOM = "PLANNER_SORT_COMPLETE_ITEMS_TO_BOTTOM",
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
      action: PayloadAction<{ preference: string; value: boolean }>
    ) => {
      const { preference, value } = action.payload;
      state.preferences[preference] = value;
    },
  },
});

export const { setPreference } = userSlice.actions;

export default userSlice.reducer;
