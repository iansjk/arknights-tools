import { Box } from "@mui/material";

import operatorsJson from "../../data/operators.json";
import { Operator } from "../../scripts/output-types";
import { PlannerGoal } from "../hooks/usePlannerData";

interface Props {
  goal: PlannerGoal;
}

const PlannerGoalCard: React.VFC<Props> = (props) => {
  const { goal } = props;
  const operator: Operator =
    operatorsJson[goal.operatorId as keyof typeof operatorsJson];

  return (
    <Box component="li" display="block" position="relative" mb={1}>
      {operator.name}
      <br />
      Category: {goal.category}
    </Box>
  );
};
export default PlannerGoalCard;
