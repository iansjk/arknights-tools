import {
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  Divider,
  NoSsr,
} from "@material-ui/core";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import { useStaticQuery, graphql } from "gatsby";
import React from "react";
import { Ingredient, Item, OperatorGoal } from "../types";
import ItemNeeded from "./ItemNeeded";
import OperatorGoalCard from "./OperatorGoalCard";
import lmdIcon from "../data/images/lmd.png";
import useLocalStorage from "../hooks/useLocalStorage";

const useStyles = makeStyles((theme) => ({
  lmdIcon: {
    marginLeft: theme.spacing(0.5),
    position: "relative",
    top: theme.spacing(0.25),
  },
  totalCostHeader: {
    fontWeight: "initial",
  },
  OperatorGoalCardsHeaderContent: {
    "&:last-child": {
      paddingBottom: theme.spacing(2),
    },
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
}));

interface GoalOverviewProps {
  goals: OperatorGoal[];
  onGoalDeleted: (goal: OperatorGoal) => void;
  onClearAllGoals: () => void;
}

const GoalOverview = React.memo(function GoalOverview(
  props: GoalOverviewProps
): React.ReactElement {
  const data = useStaticQuery(graphql`
    query {
      allItemsJson(sort: { order: DESC, fields: tier }) {
        nodes {
          name
          tier
          sortId
          yield
          ingredients {
            name
            quantity
            tier
            sortId
          }
        }
      }
    }
  `);
  const items: Record<string, Item & { sortId: number }> = Object.fromEntries(
    data.allItemsJson.nodes.map((node: { name: string }) => [node.name, node])
  );
  const { goals, onGoalDeleted, onClearAllGoals } = props;
  const [materialsOwned, setMaterialsOwned] = useLocalStorage<
    Record<string, number | null>
  >("materialsOwned", {});
  const [itemsToCraft, setItemsToCraft] = useLocalStorage<Record<string, Item>>(
    "itemsToCraft",
    {}
  );
  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const classes = useStyles();
  const ingredientMapping: Record<string, Ingredient[]> = {};
  const isComplete: Record<string, boolean> = {};
  const materialsNeeded: Record<string, number> = {};
  goals.forEach((goal) =>
    goal.ingredients.forEach((item) => {
      materialsNeeded[item.name] =
        item.quantity + (materialsNeeded[item.name] || 0);
    })
  );
  Object.values(items).forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(materialsNeeded, item.name)) {
      const needed = Math.max(
        materialsNeeded[item.name] - (materialsOwned[item.name] || 0),
        0
      );
      if (needed === 0) {
        isComplete[item.name] = true;
      } else if (
        needed > 0 &&
        Object.prototype.hasOwnProperty.call(itemsToCraft, item.name)
      ) {
        const multiplier = Math.ceil(needed / (item.yield ?? 1));
        item.ingredients?.forEach((ingredient) => {
          ingredientMapping[ingredient.name] = [
            ...(ingredientMapping[ingredient.name] || []),
            { name: item.name, tier: item.tier, quantity: ingredient.quantity },
          ];
          materialsNeeded[ingredient.name] =
            (materialsNeeded[ingredient.name] || 0) +
            ingredient.quantity * multiplier;
        });
      }
    }
  });
  const craftingMaterialsOwned = { ...materialsOwned };
  Object.keys(itemsToCraft)
    .filter(
      (itemName) =>
        materialsNeeded[itemName] &&
        materialsNeeded[itemName] - (materialsOwned[itemName] ?? 0) > 0
    )
    .sort((a, b) => itemsToCraft[a].tier - itemsToCraft[b].tier)
    .forEach((craftedItemName) => {
      const shortage =
        materialsNeeded[craftedItemName] -
        (materialsOwned[craftedItemName] ?? 0);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ingredients = itemsToCraft[craftedItemName].ingredients!.filter(
        (ingredient) => ingredient.name !== "LMD"
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const multiplier = itemsToCraft[craftedItemName].yield!;
      // numTimesCraftable = how many times the *formula* can be performed
      const numTimesCraftable = Math.min(
        ...ingredients.map((ingredient) => {
          return Math.floor(
            (craftingMaterialsOwned[ingredient.name] || 0) / ingredient.quantity
          );
        })
      );
      // numTimesToCraft = how many times we'll actually execute this formula
      const numTimesToCraft = Math.min(
        numTimesCraftable,
        Math.ceil(shortage / multiplier)
      );
      // now we deduct from our crafting mats supply
      ingredients.forEach((ingredient) => {
        craftingMaterialsOwned[ingredient.name] = Math.max(
          (craftingMaterialsOwned[ingredient.name] || 0) -
            ingredient.quantity * numTimesToCraft,
          0
        );
      });
      // if we were able to satisfy the shortage, then the end product is complete
      if (shortage - numTimesToCraft <= 0) {
        isComplete[craftedItemName] = true;
      }
      // in any case, update our new counts after crafting up our materials
      craftingMaterialsOwned[craftedItemName] =
        (craftingMaterialsOwned[craftedItemName] || 0) +
        numTimesToCraft * multiplier;
    });
  // now that we've finished crafting, if we have any ingredients left over, mark those complete
  Object.keys(ingredientMapping).forEach((ingredientName) => {
    if (
      (materialsNeeded[ingredientName] ?? 0) -
        (craftingMaterialsOwned[ingredientName] ?? 0) <=
      0
    ) {
      isComplete[ingredientName] = true;
    }
  });

  const handleIncrementOwned = React.useCallback(
    function handleIncrementOwned(itemName: string): void {
      setMaterialsOwned((prevOwned) => ({
        ...prevOwned,
        [itemName]: 1 + (prevOwned[itemName] || 0),
      }));
    },
    [setMaterialsOwned]
  );

  const handleDecrementOwned = React.useCallback(
    function handleDecrementOwned(itemName: string): void {
      setMaterialsOwned((prevOwned) => ({
        ...prevOwned,
        [itemName]: Math.max(0, (prevOwned[itemName] || 0) - 1),
      }));
    },
    [setMaterialsOwned]
  );

  const handleChangeOwned = React.useCallback(
    function handleChangeOwned(itemName: string, rawInput: string): void {
      const newValue: number | null = !rawInput ? null : parseInt(rawInput, 10);
      if (newValue === null || !Number.isNaN(newValue)) {
        setMaterialsOwned((prevOwned) => ({
          ...prevOwned,
          [itemName]: newValue,
        }));
      }
    },
    [setMaterialsOwned]
  );

  const handleCraftingToggle = React.useCallback(
    function handleCraftingToggle(itemName: string) {
      const item = items[itemName];
      setItemsToCraft((prevObj) => {
        if (Object.prototype.hasOwnProperty.call(prevObj, item.name)) {
          const newObj = { ...prevObj };
          delete newObj[item.name];
          return newObj;
        }
        return { ...prevObj, [item.name]: item };
      });
    },
    [setItemsToCraft, items]
  );

  const handleCraftOne = React.useCallback(
    function handleCraftOne(itemName: string) {
      const item = itemsToCraft[itemName];
      setMaterialsOwned((prevOwned) => {
        const newOwned = { ...prevOwned };
        item.ingredients
          ?.filter((ingredient) => ingredient.name !== "LMD")
          .forEach((ingredient) => {
            newOwned[ingredient.name] = Math.max(
              (newOwned[ingredient.name] || 0) - ingredient.quantity,
              0
            );
          });
        newOwned[itemName] = (newOwned[itemName] || 0) + 1;
        return newOwned;
      });
    },
    [itemsToCraft, setMaterialsOwned]
  );

  const handleReset = React.useCallback(
    function handleReset() {
      setItemsToCraft({});
      setMaterialsOwned({});
    },
    [setItemsToCraft, setMaterialsOwned]
  );

  function renderItemsNeeded(
    objectEntries: [string, number][]
  ): React.ReactElement[] {
    return objectEntries
      .sort(
        ([nameA, _], [nameB, __]) =>
          (isComplete[nameA] ? 1 : 0) - (isComplete[nameB] ? 1 : 0) ||
          items[nameB].tier - items[nameA].tier ||
          items[nameA].sortId - items[nameB].sortId ||
          nameA.localeCompare(nameB)
      )
      .map(([name, needed]) => {
        const item = items[name];
        const inner = (
          <ItemNeeded
            name={name}
            tier={item.tier}
            ingredients={item.ingredients}
            size={isXSmallScreen ? 75 : undefined}
            needed={needed}
            owned={
              !Object.prototype.hasOwnProperty.call(materialsOwned, name)
                ? 0
                : materialsOwned[name]
            }
            complete={isComplete[name]}
            crafting={Object.prototype.hasOwnProperty.call(itemsToCraft, name)}
            ingredientFor={ingredientMapping[name]}
            onIncrement={handleIncrementOwned}
            onDecrement={handleDecrementOwned}
            onChange={handleChangeOwned}
            onCraftingToggle={handleCraftingToggle}
            onCraftOne={handleCraftOne}
          />
        );
        const outer = isLargeScreen ? (
          <Box
            key={name}
            data-cy={name}
            width="20%"
            px={0.5}
            mt={1}
            display="block"
            component="li"
          >
            {inner}
          </Box>
        ) : (
          <Box clone display="block" key={name}>
            <Grid data-cy={name} item xs={6} sm={3} md={3} component="li">
              {inner}
            </Grid>
          </Box>
        );
        return outer;
      });
  }

  const requiredMaterials = Object.entries(materialsNeeded).filter(
    ([name, _]) => name !== "LMD"
  );

  const totalCost = materialsNeeded.LMD ?? 0;

  return (
    <Grid container spacing={2}>
      <Grid component="section" item xs={12} md={7} data-cy="materialsList">
        <Card>
          <CardContent>
            <Box clone mb={1}>
              <Grid container>
                <Grid item xs={8}>
                  <Typography component="h2" variant="h5">
                    Required materials
                  </Typography>
                  <Box my={1} width="90%">
                    <Divider />
                  </Box>
                  <Typography
                    className={classes.totalCostHeader}
                    component="span"
                    variant="h6"
                    data-cy="totalCost"
                    data-total-cost={totalCost}
                  >
                    Total cost:&nbsp;
                    <b>{totalCost.toLocaleString()}</b>
                    <img
                      className={classes.lmdIcon}
                      src={lmdIcon}
                      alt="LMD"
                      width={26}
                      height={18}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="end">
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      startIcon={<RotateLeftIcon />}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Grid container spacing={1} component="ul" className={classes.list}>
              <NoSsr>{renderItemsNeeded(requiredMaterials)}</NoSsr>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid component="section" item xs={12} md={5} data-cy="goalsList">
        <>
          <Box clone mb={1}>
            <Card>
              <CardContent className={classes.OperatorGoalCardsHeaderContent}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography component="h2" variant="h5">
                      Operator goals
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="end">
                      <Button
                        variant="outlined"
                        onClick={onClearAllGoals}
                        startIcon={<ClearAllIcon />}
                      >
                        Clear All
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
          <NoSsr>
            <ul className={classes.list}>
              {goals.map((goal) => (
                <OperatorGoalCard
                  key={`${goal.operatorName}${goal.goalName}`}
                  goal={goal}
                  skill={goal.skill}
                  onDelete={onGoalDeleted}
                />
              ))}
            </ul>
          </NoSsr>
        </>
      </Grid>
    </Grid>
  );
});
export default GoalOverview;
