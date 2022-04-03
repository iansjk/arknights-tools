import DeleteGoalIcon from "@mui/icons-material/Cancel";
import CompleteGoalIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import Image from "next/image";

import operatorsJson from "../../data/operators.json";
import { Operator, OperatorGoalCategory } from "../../scripts/output-types";
import getGoalIngredients from "../getGoalIngredients";
import { PlannerGoal } from "../hooks/usePlannerData";

import ItemStack from "./ItemStack";
import OperatorGoalIconography from "./OperatorGoalIconography";

const GoalCardButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(0.75),
  flexGrow: 1,
  backgroundColor: theme.palette.background.paper,
  "&:first-of-type": { borderTopLeftRadius: 0 },
  "&:last-of-type": { borderBottomLeftRadius: 0 },
  "&.MuiButtonGroup-grouped:not(:last-of-type)": {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
}));

interface Props {
  goal: PlannerGoal;
  onGoalDeleted: (goal: PlannerGoal) => void;
  onGoalCompleted: (goal: PlannerGoal) => void;
}

const PlannerGoalCard: React.VFC<Props> = (props) => {
  const { goal, onGoalDeleted, onGoalCompleted } = props;
  const operator: Operator =
    operatorsJson[goal.operatorId as keyof typeof operatorsJson];
  const [_, appellation] = operator.name.split(" the ");

  const goalName = (() => {
    switch (goal.category) {
      case OperatorGoalCategory.Elite:
        return `Elite ${goal.eliteLevel}`;
      case OperatorGoalCategory.SkillLevel:
        return `Skill Level ${goal.skillLevel}`;
      case OperatorGoalCategory.Mastery: {
        const skillNumber =
          operator.skills.findIndex((sk) => sk.skillId === goal.skillId) + 1;
        return `Skill ${skillNumber} Mastery ${goal.masteryLevel}`;
      }
      case OperatorGoalCategory.Module:
        return "Module";
    }
  })();
  const goalLabel = `${operator.name} ${goalName}`;

  const ingredients = getGoalIngredients(goal);

  return (
    <Paper
      component="li"
      elevation={3}
      sx={{
        display: "grid",
        mb: 1,
        gridTemplateColumns: "1fr auto",
      }}
    >
      <Paper
        sx={{
          display: "grid",
          p: 1,
          alignItems: "center",
          gridTemplateAreas: {
            xs: `
              'icon name goalname'
              'icon mats mats'
            `,
            xl: `
              'icon name     mats'
              'icon goalname mats'
            `,
          },
          gridTemplateRows: "auto auto",
          gridTemplateColumns: {
            xs: "48px auto 1fr",
            xl: "48px 200px 1fr",
          },
          columnGap: 1,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Box
          gridArea="icon"
          display="flex"
          alignSelf={{ xs: "start", xl: undefined }}
        >
          <Image
            src={`/arknights/avatars/${operator.id}`}
            width={48}
            height={48}
            alt=""
            className="operator-avatar"
          />
        </Box>

        <Typography
          component="span"
          variant="h6"
          sx={{ lineHeight: 1, gridArea: "name" }}
        >
          {appellation ?? operator.name}
        </Typography>

        <Box gridArea="goalname" display="flex" alignItems="center">
          <OperatorGoalIconography goal={goal} />
          {goalName}
        </Box>

        <Box gridArea="mats" display="flex" justifyContent="space-evenly">
          {ingredients.map((ingredient) => (
            <ItemStack
              key={ingredient.id}
              itemId={ingredient.id}
              quantity={ingredient.quantity}
              size={60}
              showItemNameTooltip={true}
            />
          ))}
        </Box>
      </Paper>

      <ButtonGroup
        orientation="vertical"
        variant="contained"
        sx={{
          display: "flex",
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <GoalCardButton
          aria-label={`Delete goal: ${goalLabel}`}
          onClick={() => onGoalDeleted(goal)}
          sx={{
            "&:hover": {
              backgroundColor: (theme) => theme.palette.error.dark,
            },
          }}
        >
          <DeleteGoalIcon />
        </GoalCardButton>
        <GoalCardButton
          aria-label={`Complete goal: ${goalLabel}`}
          onClick={() => onGoalCompleted(goal)}
          sx={{
            "&:hover": {
              backgroundColor: (theme) => theme.palette.success.dark,
            },
          }}
        >
          <CompleteGoalIcon />
        </GoalCardButton>
      </ButtonGroup>
    </Paper>
  );
};
export default PlannerGoalCard;
