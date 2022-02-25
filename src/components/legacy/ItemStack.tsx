import { makeStyles, Box, Typography } from "@material-ui/core";
import React from "react";
import { Item } from "../types";
import ItemBase from "./ItemBase";

export const defaultSize = 100;

const useStyles = makeStyles({
  quantityWrapper: {
    background: "rgba(0, 0, 0, 0.7)",
  },
});

export function formatQuantity(quantity: number): string {
  if (quantity < 1000) {
    return `${quantity}`;
  }

  return `${
    quantity % 1000 === 0 ? `${quantity / 1000}` : (quantity / 1000).toFixed(1)
  }K`;
}

interface ItemStackProps {
  quantity: number;
  complete?: boolean;
  size?: number;
}
type Props = ItemStackProps & Item;

const ItemStack = React.memo(function ItemStack({
  name,
  tier,
  quantity,
  complete = false,
  size = defaultSize,
}: Props): React.ReactElement {
  const classes = useStyles();
  const backgroundSize = size - 5;

  return (
    <Box position="relative" width={backgroundSize} height={backgroundSize}>
      <ItemBase {...{ name, tier, complete, size }} />
      <Box
        className={classes.quantityWrapper}
        position="absolute"
        right="0"
        bottom="10%"
        py="2px"
        px={1.5}
        boxShadow={3}
      >
        <Typography variant="button" data-cy="quantity">
          {formatQuantity(quantity)}
        </Typography>
      </Box>
    </Box>
  );
});
export default ItemStack;
