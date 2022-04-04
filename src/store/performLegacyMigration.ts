import { createAsyncThunk } from "@reduxjs/toolkit";

import * as PlannerV0 from "../planner-v0-types";

import { addStock, setCrafting } from "./depotSlice";
import { addGoals, PlannerGoal as V1PlannerGoal } from "./goalsSlice";
import { AppDispatch, RootState } from "./store";

const performLegacyMigration = createAsyncThunk<
  void,
  void,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("MIGRATE_V0_PLANNER_DATA", async (_, { dispatch }) => {
  const oldMaterialsOwned: PlannerV0.MaterialsOwned = JSON.parse(
    window.localStorage.getItem("materialsOwned") ?? "{}"
  );
  const oldItemsToCraft: PlannerV0.ItemsToCraft = JSON.parse(
    window.localStorage.getItem("itemsToCraft") ?? "{}"
  );
  const oldOperatorGoals: PlannerV0.OperatorGoals = JSON.parse(
    window.localStorage.getItem("operatorGoals") ?? "[]"
  );

  if (
    Object.keys(oldMaterialsOwned).length > 0 ||
    Object.keys(oldItemsToCraft).length > 0 ||
    oldOperatorGoals.length > 0
  ) {
    const [itemNameToIdJson, operatorNameToIdJson]: Array<{
      [id: string]: string;
    }> = (
      await Promise.all([
        import("../../data/item-name-to-id.json"),
        import("../../data/operator-name-to-id.json"),
      ])
    ).map((x) => x.default);

    Object.entries(oldMaterialsOwned).forEach(([itemName, quantity]) => {
      const itemId =
        itemNameToIdJson[itemName as keyof typeof itemNameToIdJson];
      if (itemId == null) {
        console.warn(`Couldn't find item ID for: ${itemName}`);
      } else {
        dispatch(addStock({ itemId, amount: quantity }));
      }
    });

    Object.keys(oldItemsToCraft).forEach((itemName) => {
      const itemId =
        itemNameToIdJson[itemName as keyof typeof itemNameToIdJson];
      if (itemId == null) {
        console.warn(`Couldn't find item ID for: ${itemName}`);
      } else {
        dispatch(setCrafting({ itemId, isCrafting: true }));
      }
    });

    const convertedGoals: V1PlannerGoal[] = oldOperatorGoals
      .map((oldGoal) => {
        const { operatorName, goalCategory } = oldGoal;
        const operatorId =
          operatorNameToIdJson[
            operatorName as keyof typeof operatorNameToIdJson
          ];
        if (operatorId == null) {
          console.warn(`Couldn't find operator ID for: ${operatorName}`);
        } else {
          let goal: V1PlannerGoal | null = null;
          switch (goalCategory) {
            case PlannerV0.OperatorGoalCategory.Elite:
              goal = {
                operatorId,
                category: goalCategory,
                eliteLevel: oldGoal.eliteLevel,
              };
              break;
            case PlannerV0.OperatorGoalCategory.Mastery: {
              const { masteryLevel } = oldGoal;
              const { skillId } = oldGoal.skill;
              goal = {
                operatorId,
                category: goalCategory,
                skillId,
                masteryLevel,
              };
              break;
            }
            case PlannerV0.OperatorGoalCategory.SkillLevel: {
              const { skillLevel } = oldGoal;
              goal = {
                operatorId,
                category: goalCategory,
                skillLevel,
              };
              break;
            }
            default:
              console.warn(`Unknown goal category: ${goalCategory}`);
          }
          return goal;
        }
      })
      .filter((goal) => goal != null) as V1PlannerGoal[];
    dispatch(addGoals(convertedGoals));
  }
});
export default performLegacyMigration;
