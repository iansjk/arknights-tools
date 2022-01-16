import { Card, CardContent, Typography } from "@mui/material";

import operators from "../data/operators.json";
import * as Output from "../scripts/output-types";

import { OperatorPlannerGoal } from "./planner-types";

const OperatorPlannerGoalCard: React.VFC<OperatorPlannerGoal> = (props) => {
  const { operatorId, elite, skillLevel, masteries } = props;
  const operator: Output.Operator =
    operators[operatorId as keyof typeof operators];
  return (
    <Card>
      <CardContent>
        <Typography component="h4" variant="h6">
          {operator.name}
        </Typography>
        <ul>
          {elite && (
            <li>
              Elite {elite.start} to Elite {elite.end}
            </li>
          )}
          {skillLevel && (
            <li>
              Skill Level {skillLevel.start} to Skill Level {skillLevel.end}
            </li>
          )}
          {masteries &&
            Object.entries(masteries).map(([skillNumber, range]) => (
              <li key={skillNumber}>
                Skill {skillNumber}: Mastery {range.start} to Mastery{" "}
                {range.end}
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
};
export default OperatorPlannerGoalCard;
