import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  ButtonBase,
  Popover,
  ButtonGroup,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import React from "react";
import {
  bindPopover,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import slugify from "../utils";
import ItemStack, { defaultSize } from "./ItemStack";
import { Ingredient, Item } from "../types";
import ItemInfoPopoverContent from "./ItemInfoPopoverContent";

const useOutlinedInputStyles = makeStyles((theme) => ({
  input: {
    textAlign: "center",
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
  },
  adornedStart: {
    paddingLeft: theme.spacing(1),
  },
  adornedEnd: {
    paddingRight: theme.spacing(1),
  },
}));

const useInputAdornmentStyles = makeStyles({
  positionStart: {
    marginRight: 0,
  },
  positionEnd: {
    marginLeft: 0,
  },
});

const useStyles = makeStyles({
  input: {
    "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "&": {
      "-moz-appearance": "textfield",
    },
  },
  itemButton: {
    "&:focus, &:active": {
      filter: "brightness(0.5)",
    },
  },
  itemInfoPopover: {
    opacity: 0.9,
  },
  craftOneButton: {
    width: "auto",
  },
});

interface ItemNeededProps {
  owned: number | null;
  needed: number;
  size?: number;
  complete?: boolean;
  crafting?: boolean;
  ingredientFor?: Ingredient[];
  onIncrement: (itemName: string) => void;
  onDecrement: (itemName: string) => void;
  onChange: (itemName: string, rawInput: string) => void;
  onCraftingToggle: (itemName: string) => void;
  onCraftOne: (itemName: string) => void;
}
type Props = ItemNeededProps & Item;

const ItemNeeded = React.memo(function ItemNeeded({
  name,
  tier,
  ingredients,
  owned,
  needed,
  size = defaultSize,
  complete = false,
  crafting = false,
  ingredientFor,
  onIncrement,
  onDecrement,
  onChange,
  onCraftingToggle,
  onCraftOne,
}: Props): React.ReactElement {
  const outlinedInputClasses = useOutlinedInputStyles();
  const inputAdornmentClasses = useInputAdornmentStyles();
  const classes = useStyles();
  const popoverState = usePopupState({
    variant: "popover",
    popupId: `${slugify(name)}-popover`,
  });
  // don't allow crafting if this item is already used to craft an ingredient of it
  // (e.g. chips: users shouldn't be allowed to craft defender chips from medic chips
  // if they are already crafting medic chips from defender chips)
  // note that this is O(N^2), but we expect N to be very small (~5 at most)
  const isCraftable =
    ingredients &&
    (!ingredientFor ||
      ingredientFor.filter((target) =>
        ingredients.find((ingredient) => ingredient.name === target.name)
      ).length === 0);
  return (
    <>
      <Box position="relative" data-cy="itemNeeded">
        <Box width="100%" textAlign="center">
          <ButtonBase
            className={classes.itemButton}
            {...bindTrigger(popoverState)}
            disableRipple
          >
            <ItemStack {...{ name, tier, size, complete }} quantity={needed} />
          </ButtonBase>
        </Box>
        <Popover
          BackdropProps={{
            invisible: false,
          }}
          className={classes.itemInfoPopover}
          hideBackdrop={false}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          {...bindPopover(popoverState)}
        >
          <ItemInfoPopoverContent
            name={name}
            tier={tier}
            ingredients={ingredients}
            ingredientFor={ingredientFor}
          />
        </Popover>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          value={owned === null ? "" : owned}
          onFocus={(event) => event.target.select()}
          onChange={(event) => onChange(name, event.target.value)}
          inputProps={{
            type: "number",
            className: classes.input,
            min: 0,
            step: 1,
            "aria-label": "Quantity owned",
            "data-cy": "ownedInput",
          }}
          InputProps={{
            classes: outlinedInputClasses,
            startAdornment: (
              <InputAdornment position="start" classes={inputAdornmentClasses}>
                <IconButton
                  aria-label="remove 1 from owned amount"
                  edge="start"
                  disabled={owned === 0}
                  onClick={() => onDecrement(name)}
                  data-cy="decrement"
                >
                  <RemoveCircleIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" classes={inputAdornmentClasses}>
                <IconButton
                  aria-label="add 1 to owned amount"
                  edge="end"
                  onClick={() => onIncrement(name)}
                  data-cy="increment"
                >
                  <AddCircleIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {isCraftable ? (
          <ButtonGroup color="secondary" fullWidth>
            <Button
              variant={crafting ? "contained" : "outlined"}
              onClick={() => onCraftingToggle(name)}
              aria-label="Toggle crafting"
              data-cy="craftingToggle"
              data-crafting={crafting}
            >
              {crafting ? "Crafting" : "Craft"}
            </Button>
            <Button
              className={classes.craftOneButton}
              aria-label="Craft one"
              disabled={!crafting}
              onClick={() => onCraftOne(name)}
            >
              +1
            </Button>
          </ButtonGroup>
        ) : (
          <Button fullWidth variant="outlined" disabled>
            (Uncraftable)
          </Button>
        )}
      </Box>
    </>
  );
});
export default ItemNeeded;
