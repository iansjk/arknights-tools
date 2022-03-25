import React from "react";

import { Crafting, Depot } from "../hooks/usePlannerData";

interface Props {
  depot: Depot;
  setDepot: React.Dispatch<React.SetStateAction<Depot>>;
  crafting: Crafting;
  setCrafting: React.Dispatch<React.SetStateAction<Crafting>>;
}

const MaterialsNeeded: React.VFC<Props> = (props) => {
  const { depot, setDepot, crafting, setCrafting } = props;
  return null;
};
export default MaterialsNeeded;
