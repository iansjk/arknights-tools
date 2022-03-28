import { Box, Divider, Paper, Typography } from "@mui/material";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";

import itemsJson from "../../data/items.json";
import getGoalIngredients from "../getGoalIngredients";
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
import { selectGoals } from "../store/goalsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import ItemNeeded from "./ItemNeeded";

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
    goals.flatMap(getGoalIngredients).forEach((ingredient) => {
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
