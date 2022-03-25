import { PlannerGoal } from "../hooks/usePlannerData";

interface Props {
  goals: PlannerGoal[];
  setGoals: React.Dispatch<React.SetStateAction<PlannerGoal[]>>;
}

const OperatorGoals: React.VFC<Props> = (props) => {
  const { goals, setGoals } = props;
  return null;
};
export default OperatorGoals;
