import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import isEqual from "lodash.isequal";

import * as Output from "../../scripts/output-types";
import { OperatorGoalCategory } from "../../scripts/output-types";

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

const getGoalKey = (goal: PlannerGoal) => {
  switch (goal.category) {
    case OperatorGoalCategory.Elite:
      return `${goal.operatorId}-${goal.category}-${goal.eliteLevel}`;
    case OperatorGoalCategory.SkillLevel:
      return `${goal.operatorId}-${goal.category}-${goal.skillLevel}`;
    case OperatorGoalCategory.Mastery:
      return `${goal.operatorId}-${goal.category}-${goal.skillId}-${goal.masteryLevel}`;
    case OperatorGoalCategory.Module:
      return `${goal.operatorId}-${goal.category}`;
  }
};

export const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    addGoals: (state, action: PayloadAction<PlannerGoal[]>) => {
      const existingKeys = new Set(state.map(getGoalKey));
      const newGoals = action.payload;
      const goalsToAdd = newGoals.filter(
        (goal) => !existingKeys.has(getGoalKey(goal))
      );
      state.unshift(...goalsToAdd);
    },
    deleteGoal: (state, action: PayloadAction<PlannerGoal>) => {
      state.forEach((goal, i) => {
        if (isEqual(goal, action.payload)) {
          state.splice(i, 1);
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      completeGoal,
      (state, action: PayloadAction<PlannerGoal>) => {
        // same as deleteGoal: remove it from goals, and let depotSlice handle removing mats
        state.forEach((goal, i) => {
          if (isEqual(goal, action.payload)) {
            state.splice(i, 1);
          }
        });
      }
    );
  },
});

export const selectGoals = (state: RootState) => state.goals;

export const { addGoals, deleteGoal } = goalsSlice.actions;

export default goalsSlice.reducer;
