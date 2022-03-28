import { Box, Divider, Paper, Typography } from "@mui/material";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";

import itemsJson from "../../data/items.json";
import operatorsJson from "../../data/operators.json";
import { Operator, OperatorGoalCategory } from "../../scripts/output-types";
import lmdIcon from "../images/lmd-icon.png";
import {
  craftOneWithStock,
  decrement,
  DepotState,
  increment,
  selectCrafting,
  selectStock,
  setStock,
  toggleCrafting,
} from "../store/depotSlice";
import { selectGoals, PlannerGoal } from "../store/goalsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

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

const MaterialsNeeded: React.VFC = () => {
  const dispatch = useAppDispatch();
  const stock = useAppSelector(selectStock);
  const crafting = useAppSelector(selectCrafting);
  const goals = useAppSelector(selectGoals);

  const handleChange = useCallback(
    (itemId: string, newQuantity: number) => {
      dispatch(setStock({ itemId, newQuantity }));
    },
    [dispatch]
  );

  const handleIncrement = useCallback(
    (itemId: string) => {
      dispatch(increment(itemId));
    },
    [dispatch]
  );

  const handleDecrement = useCallback(
    (itemId: string) => {
      dispatch(decrement(itemId));
    },
    [dispatch]
  );

  const handleCraftOne = useCallback(
    (itemId: string) => {
      dispatch(craftOneWithStock(itemId));
    },
    [dispatch]
  );

  const handleCraftingToggle = useCallback(
    (itemId: string) => {
      dispatch(toggleCrafting(itemId));
    },
    [dispatch]
  );

  const { materialsNeededEntries, totalCost } = useMemo(() => {
    let totalCost = 0;
    const needed: DepotState["stock"] = {};
    goals
      .flatMap((goal) => {
        const operator =
          operatorsJson[goal.operatorId as keyof typeof operatorsJson];
        return getGoalIngredients(operator, goal);
      })
      .forEach((ingredient) => {
        if (ingredient.id === "4001") {
          // LMD
          totalCost += ingredient.quantity;
        } else {
          needed[ingredient.id] =
            (needed[ingredient.id] ?? 0) + ingredient.quantity;
        }
      });
    return { materialsNeededEntries: Object.entries(needed), totalCost };
  }, [goals]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography component="h2" variant="h5">
        Materials needed
      </Typography>
      <Divider sx={{ my: 1, width: "90%" }} />
      <Typography component="span" variant="h6">
        Total cost:
        <Box
          component="span"
          display="inline-flex"
          alignItems="center"
          columnGap={0.5}
          ml={1}
        >
          <b>{totalCost.toLocaleString()}</b>
          <Image src={lmdIcon} width={26} height={18} alt="LMD" />
        </Box>
      </Typography>
      <Box
        component="ul"
        sx={{
          display: "grid",
          mt: 2,
          mb: 0,
          mx: 0,
          p: 0,
          columnGap: 2,
          rowGap: 1.5,
          gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
        }}
      >
        {materialsNeededEntries
          .sort(
            ([a], [b]) =>
              itemsJson[a as keyof typeof itemsJson].sortId -
              itemsJson[b as keyof typeof itemsJson].sortId
          )
          .map(([itemId, needed]) => (
            <ItemNeeded
              key={itemId}
              component="li"
              itemId={itemId}
              owned={stock[itemId] ?? 0}
              quantity={needed}
              isCrafting={crafting[itemId] ?? false}
              onChange={handleChange}
              onCraftOne={handleCraftOne}
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
              onCraftingToggle={handleCraftingToggle}
            />
          ))}
      </Box>
    </Paper>
  );
};
export default MaterialsNeeded;
