import { Typography } from "@mui/material";

import { PlannerGoal } from "../hooks/usePlannerData";
import { completeGoal } from "../store/goalsActions";
import { deleteGoal, selectGoals } from "../store/goalsSlice";
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

  return (
    <section>
      <Typography component="h3" variant="h5" sx={{ mb: 2 }}>
        Goals
      </Typography>

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
