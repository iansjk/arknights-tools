import React from "react";

import { Crafting, Depot, PlannerGoal } from "../hooks/usePlannerData";

import ItemNeeded from "./ItemNeeded";

interface Props {
  depot: Depot;
  setDepot: React.Dispatch<React.SetStateAction<Depot>>;
  crafting: Crafting;
  setCrafting: React.Dispatch<React.SetStateAction<Crafting>>;
  goals: PlannerGoal[];
}

type Needed = Depot;

const MaterialsNeeded: React.VFC<Props> = (props) => {
  const { depot, setDepot, crafting, setCrafting, goals } = props;

  const materialsNeeded: Needed = {}; // TODO

  return (
    <>
      {Object.entries(depot).map(([itemId, owned]) => (
        <ItemNeeded
          key={itemId}
          itemId={itemId}
          owned={owned}
          quantity={materialsNeeded[itemId] ?? 0}
          isCrafting={crafting[itemId] ?? false}
          onChange={() => void 0}
          onCraftOne={() => void 0}
          onDecrement={() => void 0}
          onIncrement={() => void 0}
          onCraftingToggle={() => void 0}
        />
      ))}
    </>
  );
};
export default MaterialsNeeded;
