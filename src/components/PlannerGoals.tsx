import { PlannerGoal } from "../hooks/usePlannerData";

import PlannerGoalCard from "./PlannerGoalCard";

interface Props {
  goals: PlannerGoal[];
  setGoals: React.Dispatch<React.SetStateAction<PlannerGoal[]>>;
}

const OperatorGoals: React.VFC<Props> = (props) => {
  const { goals, setGoals } = props;

  const handleGoalDeleted = (goal: PlannerGoal) => {
    setGoals((oldGoals) => {
      return oldGoals.filter((g) => g !== goal);
    });
  };

  const handleGoalCompleted = (goal: PlannerGoal) => {
    // TODO also deduct materials
    handleGoalDeleted(goal);
  };

  return (
    <>
      {goals.map((goal, i) => (
        <PlannerGoalCard
          key={i}
          goal={goal}
          onGoalDeleted={handleGoalDeleted}
          onGoalCompleted={handleGoalCompleted}
        />
      ))}
    </>
  );
};
export default OperatorGoals;
