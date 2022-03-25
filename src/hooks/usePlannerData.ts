import { useEffect } from "react";

import itemNameToIdJson from "../../data/item-name-to-id.json";
import operatorNameToIdJson from "../../data/operator-name-to-id.json";
import * as Output from "../../scripts/output-types";
import * as PlannerV0 from "../planner-v0-types";

import useLocalStorage from "./useLocalStorage";

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
export type Depot = { [itemId: string]: number };
export type Crafting = { [itemId: string]: boolean };

const usePlannerData = () => {
  const [oldMaterialsOwned] = useLocalStorage<PlannerV0.MaterialsOwned>(
    "materialsOwned",
    {}
  );
  const [oldItemsToCraft] = useLocalStorage<PlannerV0.ItemsToCraft>(
    "itemsToCraft",
    {}
  );
  const [oldOperatorGoals] = useLocalStorage<PlannerV0.OperatorGoals>(
    "operatorGoals",
    []
  );

  const [version, setVersion] = useLocalStorage("version", 0);
  const [depot, setDepot] = useLocalStorage<Depot>("depot", {});
  const [goals, setGoals] = useLocalStorage<PlannerGoal[]>("goals", []);
  const [crafting, setCrafting] = useLocalStorage<Crafting>("crafting", {});

  useEffect(() => {
    if (version < 1) {
      // need to migrate old data
      const migratedDepot: Depot = { ...depot };
      Object.entries(oldMaterialsOwned).forEach(([itemName, quantity]) => {
        const itemId =
          itemNameToIdJson[itemName as keyof typeof itemNameToIdJson];
        if (itemId == null) {
          console.warn(`Couldn't find item ID for: ${itemName}`);
        }
        migratedDepot[itemId] = (migratedDepot[itemId] ?? 0) + quantity;
      });

      const migratedGoals: PlannerGoal[] = [...goals];
      oldOperatorGoals.forEach((oldGoal) => {
        const { operatorName, goalCategory } = oldGoal;
        const operatorId =
          operatorNameToIdJson[
            operatorName as keyof typeof operatorNameToIdJson
          ];
        if (operatorId == null) {
          console.warn(`Couldn't find operator ID for: ${operatorName}`);
        }

        switch (goalCategory) {
          case PlannerV0.OperatorGoalCategory.Elite:
            migratedGoals.push({
              operatorId,
              category: goalCategory,
              eliteLevel: oldGoal.eliteLevel,
            });
            break;
          case PlannerV0.OperatorGoalCategory.Mastery: {
            const { masteryLevel } = oldGoal;
            const { skillId } = oldGoal.skill;
            migratedGoals.push({
              operatorId,
              category: goalCategory,
              skillId,
              masteryLevel,
            });
            break;
          }
          case PlannerV0.OperatorGoalCategory.SkillLevel: {
            const { skillLevel } = oldGoal;
            migratedGoals.push({
              operatorId,
              category: goalCategory,
              skillLevel,
            });
            break;
          }
          default:
            console.warn(`Unknown goal category: ${goalCategory}`);
        }
      });

      const migratedCrafting: Crafting = { ...crafting };
      Object.keys(oldItemsToCraft).forEach((itemName) => {
        const itemId =
          itemNameToIdJson[itemName as keyof typeof itemNameToIdJson];
        if (itemId == null) {
          console.warn(`Couldn't find item ID for: ${itemName}`);
        }
        migratedCrafting[itemId] = true;
      });

      setDepot(migratedDepot);
      setGoals(migratedGoals);
      setCrafting(migratedCrafting);
      setVersion(1);
    }
  }, [version]);

  return {
    depot,
    setDepot,
    goals,
    setGoals,
    crafting,
    setCrafting,
  };
};
export default usePlannerData;
