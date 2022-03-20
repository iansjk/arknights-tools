import * as PlannerV0 from "../planner-v0-types";

import useLocalStorage from "./useLocalStorage";

const usePlannerData = () => {
  const [materialsOwned] = useLocalStorage<PlannerV0.MaterialsOwned>(
    "materialsOwned",
    {}
  );
  const [itemsToCraft] = useLocalStorage<PlannerV0.ItemsToCraft>(
    "itemsToCraft",
    {}
  );
  const [operatorGoals] = useLocalStorage<PlannerV0.OperatorGoals>(
    "operatorGoals",
    []
  );
};
export default usePlannerData;
