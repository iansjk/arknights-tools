import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Button, ButtonGroup } from "@mui/material";

import items from "../data/items.json";
import * as Output from "../scripts/output-types";

import ItemStack, { ItemStackProps } from "./ItemStack";

interface Props extends ItemStackProps {
  owned: number;
  isCrafting: boolean;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onChange: (itemId: string, newQuantity: number) => void;
  onCraftingToggle: (itemId: string) => void;
  onCraftOne: (itemId: string) => void;
}

const ItemNeeded: React.VFC<Props> = (props) => {
  const {
    owned,
    isCrafting,
    onIncrement,
    onDecrement,
    onChange,
    onCraftingToggle,
    onCraftOne,
    ...rest
  } = props;
  const { id, quantity: needed } = rest;
  const item: Output.Item = items[id as keyof typeof items];
  const isCraftable = Boolean(item.ingredients);
  const isComplete = owned >= needed;

  return (
    <Box display="inline-grid">
      <Box
        sx={{
          display: "inline-grid",
          alignSelf: "center",
          justifySelf: "center",
          "& > *": {
            gridArea: "1 / -1",
          },
        }}
      >
        <ItemStack {...rest} sx={isComplete ? { opacity: 0.5 } : undefined} />
        {isComplete && (
          <CheckCircleIcon
            htmlColor="greenyellow"
            fontSize="large"
            sx={{
              alignSelf: "center",
              justifySelf: "center",
              zIndex: 1,
            }}
          />
        )}
      </Box>
      {isCraftable ? (
        <ButtonGroup></ButtonGroup>
      ) : (
        <Button fullWidth disabled>
          (Uncraftable)
        </Button>
      )}
    </Box>
  );
};
export default ItemNeeded;
