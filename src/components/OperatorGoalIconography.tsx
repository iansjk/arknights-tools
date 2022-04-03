import { Box } from "@mui/material";
import clsx from "clsx";
import Image from "next/image";

import operatorsJson from "../../data/operators.json";
import { Operator, OperatorGoalCategory } from "../../scripts/output-types";
import { PlannerGoal } from "../hooks/usePlannerData";
interface Props {
  goal: PlannerGoal;
}

const OperatorGoalIconography: React.VFC<Props> = ({ goal }) => {
  const operator: Operator =
    operatorsJson[goal.operatorId as keyof typeof operatorsJson];

  let icon = null;
  switch (goal.category) {
    case OperatorGoalCategory.Elite:
      if (goal.eliteLevel >= 1) {
        icon = (
          <Image
            src={`/arknights/elite/${goal.eliteLevel}`}
            width={24}
            height={24}
            alt=""
          />
        );
      }
      break;
    case OperatorGoalCategory.Mastery: {
      const skill = operator.skills.find((sk) => sk.skillId === goal.skillId)!;
      icon = (
        <>
          <Image
            src={`/arknights/skills/${skill.iconId ?? skill.skillId}`}
            width={24}
            height={24}
            alt=""
          />
          <Image
            src={`/arknights/mastery/${goal.masteryLevel}`}
            width={24}
            height={24}
            alt=""
          />
        </>
      );
      break;
    }
    case OperatorGoalCategory.SkillLevel:
      if (goal.skillLevel >= 2 && goal.skillLevel < 4) {
        icon = (
          <Image
            src="/arknights/items/MTL_SKILL1"
            width={24}
            height={24}
            alt=""
          />
        );
      } else if (goal.skillLevel >= 4 && goal.skillLevel < 6) {
        icon = (
          <Image
            src="/arknights/items/MTL_SKILL2"
            width={24}
            height={24}
            alt=""
          />
        );
      } else {
        icon = (
          <Image
            src="/arknights/items/MTL_SKILL3"
            width={24}
            height={24}
            alt=""
          />
        );
      }
      break;
    case OperatorGoalCategory.Module:
      icon = (
        <Image
          src="/arknights/items/mod_unlock_token"
          width={24}
          height={24}
          alt=""
        />
      );
      break;
  }
  if (icon != null) {
    return (
      <Box
        className={clsx(
          goal.category === OperatorGoalCategory.Elite && "elite"
        )}
        component="span"
        mr={0.5}
        sx={{
          lineHeight: 0,
          "&.elite": {
            position: "relative",
            top: "-2px",
          },
        }}
      >
        {icon}
      </Box>
    );
  }
  return null;
};
export default OperatorGoalIconography;
