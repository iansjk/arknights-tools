import ClearAllIcon from "@mui/icons-material/ClearAll";
import { Button, Paper, Typography } from "@mui/material";

import { completeGoal } from "../store/goalsActions";
import { PlannerGoal, clearAllGoals, deleteGoal, selectGoals } from "../store/goalsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import PlannerGoalCard from "./PlannerGoalCard";

const OperatorGoals: React.VFC = () => {
  const dispatch = useAppDispatch();
  const goals = useAppSelector(selectGoals);

  const handleGoalDeleted = (goal: PlannerGoal) => {
    dispatch(deleteGoal(goal));
  };

  const handleGoalCompleted = (goal: PlannerGoal) => {
    dispatch(completeGoal(goal));
  };

  const handleClearAll = () => {
    dispatch(clearAllGoals());
  };

  return (
    <section>
      <Paper
        sx={{
          display: "grid",
          mb: 1,
          p: 2,
          gridTemplateColumns: "1fr auto",
        }}
      >
        <Typography component="h3" variant="h5">
          Operator goals
        </Typography>
        <Button
          onClick={handleClearAll}
          startIcon={<ClearAllIcon />}
          variant="outlined"
          color="grey"
        >
          Clear All
        </Button>
      </Paper>

      {goals.map((goal, i) => (
        <PlannerGoalCard
          key={i}
          goal={goal}
          onGoalDeleted={handleGoalDeleted}
          onGoalCompleted={handleGoalCompleted}
        />
      ))}
    </section>
  );
};
export default OperatorGoals;
