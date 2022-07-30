import operatorsJson from "../data/operators.json";
import { Operator, OperatorGoalCategory } from "../scripts/output-types";

import type { PlannerGoal } from "./store/goalsSlice";

const getGoalIngredients = (goal: PlannerGoal) => {
  const operator: Operator =
    operatorsJson[goal.operatorId as keyof typeof operatorsJson];
  switch (goal.category) {
    case OperatorGoalCategory.Elite:
      return operator.elite[goal.eliteLevel - 1].ingredients;
    case OperatorGoalCategory.SkillLevel:
      return operator.skillLevels[goal.skillLevel - 2].ingredients;
    case OperatorGoalCategory.Mastery: {
      const skill = operator.skills.find((sk) => sk.skillId === goal.skillId)!;
      return skill.masteries[goal.masteryLevel - 1].ingredients;
    }
    case OperatorGoalCategory.Module:
      return operator.modules.find((mod) => mod.moduleId === goal.moduleId)!
        .stages[goal.moduleLevel - 1].ingredients;
  }
};
export default getGoalIngredients;
