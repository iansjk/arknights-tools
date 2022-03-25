import { PlannerGoal } from "../hooks/usePlannerData";

import PlannerGoalCard from "./PlannerGoalCard";

interface Props {
  goals: PlannerGoal[];
  setGoals: React.Dispatch<React.SetStateAction<PlannerGoal[]>>;
}

const OperatorGoals: React.VFC<Props> = (props) => {
  const { goals, setGoals } = props;
  return (
    <>
      {goals.map((goal, i) => (
        <PlannerGoalCard key={i} goal={goal} />
      ))}
    </>
  );
};
export default OperatorGoals;
