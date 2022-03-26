import { PlannerGoal } from "../hooks/usePlannerData";

import PlannerGoalCard from "./PlannerGoalCard";

interface Props {
  goals: PlannerGoal[];
  setGoals: React.Dispatch<React.SetStateAction<PlannerGoal[]>>;
}

const OperatorGoals: React.VFC<Props> = (props) => {
  const { goals, setGoals } = props;

  // TODO
  const handleGoalDeleted = (goal: PlannerGoal) => {};
  // TODO
  const handleGoalCompleted = (goal: PlannerGoal) => {};

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
