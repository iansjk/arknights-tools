import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";

import operatorsJson from "../../data/operators.json";
import { Operator, OperatorGoalCategory } from "../../scripts/output-types";
import { PlannerGoal } from "../hooks/usePlannerData";

import ItemStack from "./ItemStack";

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
    <Box
      component="li"
      display="grid"
      gridTemplateRows="32px auto"
      gridTemplateColumns="32px 1fr auto"
      columnGap={1}
      rowGap={0.5}
      mb={1}
      sx={{
        "& .operator-avatar": {
          borderRadius: "50%",
        },
      }}
    >
      <Image
        src={`/images/avatars/${operator.id}.png`}
        width={32}
        height={32}
        alt=""
        className="operator-avatar"
      />
      <Typography component="span" variant="h6">
        {appellation ?? operator.name}
      </Typography>

      <Box gridRow="span 2">
        {ingredients.map((ingredient) => (
          <ItemStack
            key={ingredient.id}
            itemId={ingredient.id}
            quantity={ingredient.quantity}
            size={60}
          />
        ))}
      </Box>

      <Box gridColumn="span 2">
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
    </Box>
  );
};
export default PlannerGoalCard;
