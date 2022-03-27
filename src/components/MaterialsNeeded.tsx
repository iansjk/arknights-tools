import { Paper } from "@mui/material";
import React from "react";

import operatorsJson from "../../data/operators.json";
import { Operator, OperatorGoalCategory } from "../../scripts/output-types";
import { Crafting, Depot, PlannerGoal } from "../hooks/usePlannerData";

import ItemNeeded from "./ItemNeeded";

export const getGoalIngredients = (operator: Operator, goal: PlannerGoal) => {
  switch (goal.category) {
    case OperatorGoalCategory.Elite:
      return operator.elite[goal.eliteLevel - 1].ingredients;
    case OperatorGoalCategory.SkillLevel:
      return operator.skillLevels[goal.skillLevel - 2].ingredients;
    case OperatorGoalCategory.Mastery: {
      const skill = operator.skills.find((sk) => sk.skillId === goal.skillId)!;
      return skill.masteries[goal.masteryLevel - 1].ingredients;
    }
    case OperatorGoalCategory.Module:
      return operator.module!.ingredients;
  }
};

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

  const materialsNeeded: Needed = {};
  goals
    .flatMap((goal) => {
      const operator =
        operatorsJson[goal.operatorId as keyof typeof operatorsJson];
      return getGoalIngredients(operator, goal);
    })
    .forEach((ingredient) => {
      materialsNeeded[ingredient.id] =
        (materialsNeeded[ingredient.id] ?? 0) + ingredient.quantity;
    });

  return (
    <Paper
      component="ul"
      sx={{
        display: "grid",
        m: 0,
        p: 2,
        gap: 2,
        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
      }}
    >
      {Object.entries(materialsNeeded).map(([itemId, needed]) => (
        <ItemNeeded
          key={itemId}
          component="li"
          itemId={itemId}
          owned={depot[itemId] ?? 0}
          quantity={needed}
          isCrafting={crafting[itemId] ?? false}
          onChange={() => void 0}
          onCraftOne={() => void 0}
          onDecrement={() => void 0}
          onIncrement={() => void 0}
          onCraftingToggle={() => void 0}
        />
      ))}
    </Paper>
  );
};
export default MaterialsNeeded;
