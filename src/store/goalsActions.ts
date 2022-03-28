import { createAction } from "@reduxjs/toolkit";

import type { PlannerGoal } from "./goalsSlice";

export const completeGoal = createAction<PlannerGoal>("completeGoal");
