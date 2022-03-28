import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import * as Output from "../../scripts/output-types";

import { completeGoal } from "./goalsActions";
import type { RootState } from "./store";

interface BasePlannerGoal {
  operatorId: string;
  category: Output.OperatorGoalCategory;
}

interface PlannerEliteGoal extends BasePlannerGoal {
  category: Output.OperatorGoalCategory.Elite;
  eliteLevel: number;
}

interface PlannerMasteryGoal extends BasePlannerGoal {
  category: Output.OperatorGoalCategory.Mastery;
  skillId: string;
  masteryLevel: number;
}

interface PlannerModuleGoal extends BasePlannerGoal {
  category: Output.OperatorGoalCategory.Module;
}

interface PlannerSkillLevelGoal extends BasePlannerGoal {
  category: Output.OperatorGoalCategory.SkillLevel;
  skillLevel: number;
}

export type PlannerGoal =
  | PlannerEliteGoal
  | PlannerMasteryGoal
  | PlannerModuleGoal
  | PlannerSkillLevelGoal;

export type GoalsState = PlannerGoal[];

const initialState: GoalsState = [];

export const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<PlannerGoal>) => {
      state.push(action.payload);
    },
    removeGoal: (_state, _action: PayloadAction<PlannerGoal>) => {
      throw new Error("Not yet implemented");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(completeGoal, (_state, _action) => {
      throw new Error("Not yet implemented");
    });
  },
});

export const selectGoals = (state: RootState) => state.goals;

export const { addGoal, removeGoal } = goalsSlice.actions;

export default goalsSlice.reducer;
