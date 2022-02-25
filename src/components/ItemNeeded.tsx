import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";

import items from "../../data/items.json";
import * as Output from "../../scripts/output-types";

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
  const [rawValue, setRawValue] = useState<string>(`${owned}`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRawValue = e.target.value;
    setRawValue(newRawValue);
    const numberValue = Number(newRawValue);
    if (!Number.isNaN(numberValue)) {
      onChange(id, numberValue);
    }
  };

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
      <TextField
        size="small"
        fullWidth
        value={rawValue}
        onFocus={(e) => e.target.select()}
        onChange={handleChange}
        inputProps={{
          type: "number",
          min: 0,
          step: 1,
          "aria-label": "Quantity owned",
          sx: {
            textAlign: "center",
            width: "4ch", // width of 4 "0" characters
            "flex-grow": "1",
            "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
            "-moz-appearance": "textfield",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 0 }}>
              <IconButton
                size="small"
                aria-label="Remove 1 from owned amount"
                edge="start"
                disabled={owned === 0}
                onClick={() => onDecrement(id)}
              >
                <RemoveCircleIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end" sx={{ ml: 0 }}>
              <IconButton
                size="small"
                aria-label="Add 1 to owned amount"
                edge="end"
                onClick={() => onIncrement(id)}
              >
                <AddCircleIcon />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            px: "5px",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      />
      <Box minWidth={126}>
        {isCraftable ? (
          <ButtonGroup
            size="small"
            color="secondary"
            fullWidth
            sx={{
              mt: "-1px",
              "& > button": {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              },
            }}
          >
            <Button
              variant={isCrafting ? "contained" : "outlined"}
              onClick={() => onCraftingToggle(id)}
              aria-label="Toggle crafting"
              aria-pressed={isCrafting}
            >
              {isCrafting ? "Crafting" : "Craft"}
            </Button>
            <Tooltip title="Craft one using your materials">
              <Button
                disabled={!isCrafting}
                onClick={() => onCraftOne(id)}
                sx={{ width: "auto" }}
              >
                +1
              </Button>
            </Tooltip>
          </ButtonGroup>
        ) : (
          <Button
            size="small"
            fullWidth
            variant="outlined"
            disabled
            sx={{ mt: "-1px", borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          >
            (Uncraftable)
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default ItemNeeded;