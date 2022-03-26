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
import { useMemo } from "react";

import operatorsJson from "../../data/operators.json";
import { Operator, OperatorGoalCategory } from "../../scripts/output-types";
import { PlannerGoal } from "../hooks/usePlannerData";

import ItemStack from "./ItemStack";
import OperatorGoalIconography from "./OperatorGoalIconography";

const GoalCardButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(0.75),
  flexGrow: 1,
  backgroundColor: "rgba(255, 255, 255, 0.4)",
  clipPath: "inset(-5px -5px -5px 0)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  "&:first-of-type": { borderTopLeftRadius: 0 },
  "&:last-of-type": { borderBottomLeftRadius: 0 },
  "&.MuiButtonGroup-grouped:not(:last-of-type)": {
    borderColor: "rgba(0, 0, 0, 0.8)",
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

  const ingredients = useMemo(() => {
    switch (goal.category) {
      case OperatorGoalCategory.Elite:
        return operator.elite[goal.eliteLevel - 1].ingredients;
      case OperatorGoalCategory.SkillLevel:
        return operator.skillLevels[goal.skillLevel - 2].ingredients;
      case OperatorGoalCategory.Mastery: {
        const skill = operator.skills.find(
          (sk) => sk.skillId === goal.skillId
        )!;
        return skill.masteries[goal.masteryLevel - 1].ingredients;
      }
      case OperatorGoalCategory.Module:
        return operator.module!.ingredients;
    }
  }, [goal, operator]);

  return (
    <Box component="li" display="grid" gridTemplateColumns="1fr auto">
      <Paper
        elevation={3}
        sx={{
          display: "grid",
          mb: 1,
          p: 1,
          alignItems: "center",
          gridTemplateRows: "auto auto",
          gridTemplateColumns: "48px 200px 1fr",
          columnGap: 1,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          clipPath: "inset(-5px 0 -5px -5px)",
          "& .operator-avatar": {
            borderRadius: "50%",
          },
        }}
      >
        <Box display="flex" gridRow="span 2">
          <Image
            src={`/images/avatars/${operator.id}.png`}
            width={48}
            height={48}
            alt=""
            className="operator-avatar"
          />
        </Box>

        <Typography component="span" variant="h6" sx={{ lineHeight: 1 }}>
          {appellation ?? operator.name}
        </Typography>

        <Box gridRow="span 2" display="flex" justifyContent="space-evenly">
          {ingredients.map((ingredient) => (
            <ItemStack
              key={ingredient.id}
              itemId={ingredient.id}
              quantity={ingredient.quantity}
              size={60}
            />
          ))}
        </Box>

        <Box display="flex" alignItems="center">
          <OperatorGoalIconography goal={goal} />
          {goalName}
        </Box>
      </Paper>

      <ButtonGroup
        orientation="vertical"
        variant="contained"
        sx={{
          display: "flex",
          pb: 1,
        }}
      >
        <GoalCardButton
          aria-label={`Delete goal: ${goalLabel}`}
          onClick={() => onGoalDeleted(goal)}
        >
          <DeleteGoalIcon />
        </GoalCardButton>
        <GoalCardButton
          aria-label={`Complete goal: ${goalLabel}`}
          onClick={() => onGoalCompleted(goal)}
        >
          <CompleteGoalIcon />
        </GoalCardButton>
      </ButtonGroup>
    </Box>
  );
};
export default PlannerGoalCard;
