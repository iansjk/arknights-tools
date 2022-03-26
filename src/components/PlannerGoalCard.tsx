import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";

import operatorsJson from "../../data/operators.json";
import { Operator, OperatorGoalCategory } from "../../scripts/output-types";
import { PlannerGoal } from "../hooks/usePlannerData";

import ItemStack from "./ItemStack";
import OperatorGoalIconography from "./OperatorGoalIconography";

interface Props {
  goal: PlannerGoal;
}

const PlannerGoalCard: React.VFC<Props> = (props) => {
  const { goal } = props;
  const operator: Operator =
    operatorsJson[goal.operatorId as keyof typeof operatorsJson];
  const [_, appellation] = operator.name.split(" the ");

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
    <Paper
      component="li"
      elevation={3}
      sx={{
        display: "grid",
        mb: 1,
        p: 1,
        alignItems: "center",
        gridTemplateRows: "auto auto",
        gridTemplateColumns: "48px 40% 1fr",
        columnGap: 1,
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
        {(() => {
          switch (goal.category) {
            case OperatorGoalCategory.Elite:
              return `Elite ${goal.eliteLevel}`;
            case OperatorGoalCategory.SkillLevel:
              return `Skill Level ${goal.skillLevel}`;
            case OperatorGoalCategory.Mastery: {
              const skillNumber =
                operator.skills.findIndex((sk) => sk.skillId === goal.skillId) +
                1;
              return `Skill ${skillNumber} Mastery ${goal.masteryLevel}`;
            }
            case OperatorGoalCategory.Module:
              return "Module";
          }
        })()}
      </Box>
    </Paper>
  );
};
export default PlannerGoalCard;
