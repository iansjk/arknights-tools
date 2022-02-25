import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  makeStyles,
  Typography,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import React from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import ItemStack from "./ItemStack";
import OperatorGoalIconography from "./OperatorGoalIconography";
import {
  EliteGoal,
  isEliteGoal,
  isMasteryGoal,
  MasteryGoal,
  OperatorGoal,
  OperatorSkill,
  SkillLevelGoal,
} from "../types";
import { getOperatorImagePublicId } from "../utils";

const useStyles = makeStyles((theme) => ({
  deleteIconButton: {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    padding: 0,
  },
  goalOuterGridContainer: {
    alignItems: "center",
  },
  goalCard: {
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
  },
  goalShortName: {
    lineHeight: theme.typography.h6.lineHeight,
  },
  operatorNameWrapper: {
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  operatorName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
  },
}));

export interface OperatorGoalCardProps {
  goal: OperatorGoal & (EliteGoal | MasteryGoal | SkillLevelGoal);
  skill?: OperatorSkill;
  onDelete: (goal: OperatorGoal) => void;
}

const OperatorGoalCard = React.memo(function OperatorGoalCard(
  props: OperatorGoalCardProps
): React.ReactElement {
  const { goal, skill, onDelete } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isMdScreen = useMediaQuery(theme.breakpoints.only("md"));
  const shouldTextBeCollapsed = isXSmallScreen || isMdScreen;
  const gradientEnd = shouldTextBeCollapsed ? "130px" : "100px";
  const bgImagePositionX = shouldTextBeCollapsed ? "-40px" : "-30px";
  let eliteLevel = 1;
  if (isMasteryGoal(goal)) {
    eliteLevel = 2;
  } else if (isEliteGoal(goal)) {
    eliteLevel = goal.eliteLevel;
  }
  const operatorImageUrl = `https://res.cloudinary.com/samidare/image/upload/e_sharpen/f_auto,q_auto/v1/${getOperatorImagePublicId(
    goal.operatorName,
    eliteLevel
  )}`;
  const goalCardStyle = {
    backgroundImage: `linear-gradient(to right, transparent, ${theme.palette.background.paper} ${gradientEnd}), url("${operatorImageUrl}")`,
    paddingLeft: shouldTextBeCollapsed ? "2rem" : "3rem",
    backgroundPosition: `${bgImagePositionX} center`,
  };
  const operatorAlterTextStyle = isXSmallScreen
    ? {
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: "1px",
        overflow: "hidden",
        position: "absolute" as const,
        whiteSpace: "nowrap" as const,
        width: "1px",
      }
    : {};
  const handleClick = React.useCallback(() => onDelete(goal), [goal, onDelete]);
  const [alter, appellation] = goal.operatorName.split(" the ");
  return (
    <Box
      mb={1}
      position="relative"
      data-cy="operatorGoalCard"
      data-operator-name={goal.operatorName}
      data-goal-name={goal.goalName}
      display="block"
      component="li"
    >
      <Card className={classes.goalCard} style={goalCardStyle}>
        <CardContent>
          <Grid container className={classes.goalOuterGridContainer}>
            <Grid item xs sm={4} md lg={4}>
              <Grid container>
                <Grid
                  className={classes.operatorNameWrapper}
                  item
                  xs
                  sm={12}
                  md
                  lg={12}
                >
                  <Box mr={2} pl={shouldTextBeCollapsed ? "0.5em" : 0}>
                    <Typography
                      component="span"
                      variant="h6"
                      className={classes.operatorName}
                      data-cy="operatorName"
                    >
                      {appellation && (
                        <Typography
                          component="span"
                          variant="overline"
                          style={operatorAlterTextStyle}
                        >
                          {alter} the&nbsp;
                        </Typography>
                      )}
                      {appellation ?? goal.operatorName}
                    </Typography>
                  </Box>
                </Grid>
                <Box
                  clone
                  display="flex"
                  whiteSpace="nowrap"
                  alignItems="center"
                  data-cy="goalName"
                >
                  <Grid item xs sm={12} md lg={12}>
                    <OperatorGoalIconography goal={goal} skill={skill} />
                    <Typography
                      className={classes.goalShortName}
                      component="span"
                      variant="subtitle1"
                      aria-label={goal.goalName}
                    >
                      {goal.goalShortName ?? goal.goalName}
                    </Typography>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={8} md={12} lg={8}>
              <Grid container justify="space-evenly">
                {goal.ingredients.map((ingredient) => (
                  <Grid item xs={3} key={ingredient.name}>
                    <ItemStack
                      name={ingredient.name}
                      tier={ingredient.tier}
                      quantity={ingredient.quantity}
                      size={isXSmallScreen ? 60 : 70}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <IconButton
            aria-label="Delete this goal"
            className={classes.deleteIconButton}
            onClick={handleClick}
            data-cy="deleteGoal"
          >
            <CancelIcon />
          </IconButton>
        </CardContent>
      </Card>
    </Box>
  );
});
export default OperatorGoalCard;
