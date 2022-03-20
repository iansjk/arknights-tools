import { Box, Card, CardContent, styled, Typography } from "@mui/material";
import Image from "next/image";

import operators from "../../data/operators.json";
import * as Output from "../../scripts/output-types";
import { OperatorPlannerGoal } from "../planner-v1-types";

const OperatorGoalList = styled("ul")(({ theme }) => ({
  margin: theme.spacing(0, 0, 0, 1.5),
  padding: 0,
  listStyleType: "'- '",
}));

const OperatorGoalListItem = styled("li")(({ theme }) => ({}));

const getPortraitSrc = (operator: Output.Operator, elite: number) => {
  let filename = `${operator.id}_${elite === 2 ? 2 : 1}.png`;
  if (operator.id === "char_002_amiya" && elite === 1) {
    filename = "char_002_amiya_1+.png";
  }
  return `/images/portraits/${filename}`;
};

const OperatorPlannerGoalCard: React.VFC<OperatorPlannerGoal> = (props) => {
  const { operatorId, elite, skillLevel, masteries } = props;
  const operator: Output.Operator =
    operators[operatorId as keyof typeof operators];
  return (
    <Card
      component="li"
      sx={{
        position: "relative",
      }}
    >
      <Box
        position="absolute"
        left={-30}
        top={-40}
        sx={{
          "& img": {
            maskImage:
              "linear-gradient(to right, black, black 40%, transparent 80%)",
          },
        }}
      >
        <Image
          src={getPortraitSrc(operator, masteries ? 2 : elite?.end ?? 0)}
          width={130}
          height={260}
          objectFit="contain"
          objectPosition="bottom"
          alt=""
        />
      </Box>
      <CardContent sx={{ pl: 8, position: "relative", zIndex: 1 }}>
        <Typography component="h4" variant="h6" gutterBottom>
          {operator.name}
        </Typography>
        <OperatorGoalList>
          {elite && (
            <OperatorGoalListItem>
              Elite {elite.start} to Elite {elite.end}
            </OperatorGoalListItem>
          )}
          {skillLevel && (
            <OperatorGoalListItem>
              Skill Level {skillLevel.start} to Skill Level {skillLevel.end}
            </OperatorGoalListItem>
          )}
          {masteries &&
            Object.entries(masteries).map(([skillNumber, range]) => (
              <OperatorGoalListItem key={skillNumber}>
                Skill {skillNumber}: Mastery {range.start} to Mastery{" "}
                {range.end}
              </OperatorGoalListItem>
            ))}
        </OperatorGoalList>
      </CardContent>
    </Card>
  );
};
export default OperatorPlannerGoalCard;
