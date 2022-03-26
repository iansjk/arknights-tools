import Image from "next/image";

import operatorsJson from "../../data/operators.json";
import { Operator, OperatorGoalCategory } from "../../scripts/output-types";
import { PlannerGoal } from "../hooks/usePlannerData";
import elite1Icon from "../images/elite/1.png";
import elite2Icon from "../images/elite/2.png";
import mastery1Icon from "../images/mastery/m-1.png";
import mastery2Icon from "../images/mastery/m-2.png";
import mastery3Icon from "../images/mastery/m-3.png";
import moduleIcon from "../images/mod_unlock_token.png";
import skillBook1Icon from "../images/MTL_SKILL1.png";
import skillBook2Icon from "../images/MTL_SKILL2.png";
import skillBook3Icon from "../images/MTL_SKILL3.png";

interface Props {
  goal: PlannerGoal;
}

const OperatorGoalIconography: React.VFC<Props> = ({ goal }) => {
  const operator: Operator =
    operatorsJson[goal.operatorId as keyof typeof operatorsJson];
  switch (goal.category) {
    case OperatorGoalCategory.Elite:
      if (goal.eliteLevel === 1) {
        return <Image src={elite1Icon} width={24} height={24} alt="" />;
      } else if (goal.eliteLevel === 2) {
        return <Image src={elite2Icon} width={24} height={24} alt="" />;
      }
      return null;
    case OperatorGoalCategory.Mastery: {
      const skill = operator.skills.find((sk) => sk.skillId === goal.skillId)!;
      const skillImage = (
        <Image
          src={`/images/skills/skill_icon_${skill.iconId ?? skill.skillId}.png`}
          width={24}
          height={24}
          alt=""
        />
      );
      if (goal.masteryLevel === 1) {
        return (
          <>
            {skillImage}
            <Image src={mastery1Icon} width={24} height={24} alt="" />
          </>
        );
      } else if (goal.masteryLevel === 2) {
        return (
          <>
            {skillImage}
            <Image src={mastery2Icon} width={24} height={24} alt="" />
          </>
        );
      } else if (goal.masteryLevel === 3) {
        return (
          <>
            {skillImage}
            <Image src={mastery3Icon} width={24} height={24} alt="" />
          </>
        );
      }
      return null;
    }
    case OperatorGoalCategory.SkillLevel:
      if (goal.skillLevel >= 2 && goal.skillLevel < 4) {
        return <Image src={skillBook1Icon} width={24} height={24} alt="" />;
      } else if (goal.skillLevel >= 4 && goal.skillLevel < 6) {
        return <Image src={skillBook2Icon} width={24} height={24} alt="" />;
      } else {
        return <Image src={skillBook3Icon} width={24} height={24} alt="" />;
      }
    case OperatorGoalCategory.Module:
      return <Image src={moduleIcon} width={24} height={24} alt="" />;
    default:
      return null;
  }
};
export default OperatorGoalIconography;
