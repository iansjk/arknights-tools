import { Grid } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

import { Operator, OperatorGoalCategory } from "../../../scripts/output-types";
import GoalSelect from "../../components/GoalSelect";
import Layout from "../../components/Layout";
import MaterialsNeeded from "../../components/MaterialsNeeded";
import OperatorSearch from "../../components/OperatorSearch";
import PlannerGoals from "../../components/PlannerGoals";
import usePlannerData, { PlannerGoal } from "../../hooks/usePlannerData";

const getGoalKey = (goal: PlannerGoal) => {
  switch (goal.category) {
    case OperatorGoalCategory.Elite:
      return `${goal.operatorId}-${goal.category}-${goal.eliteLevel}`;
    case OperatorGoalCategory.SkillLevel:
      return `${goal.operatorId}-${goal.category}-${goal.skillLevel}`;
    case OperatorGoalCategory.Mastery:
      return `${goal.operatorId}-${goal.category}-${goal.skillId}-${goal.masteryLevel}`;
    case OperatorGoalCategory.Module:
      return `${goal.operatorId}-${goal.category}`;
  }
};

const Planner: NextPage = () => {
  const [operator, setOperator] = useState<Operator | null>(null);
  const { depot, setDepot, crafting, setCrafting, goals, setGoals } =
    usePlannerData();

  const handleGoalsAdded = (newGoals: PlannerGoal[]) => {
    setGoals((oldGoals) => {
      const existingKeys = new Set(oldGoals.map(getGoalKey));
      const goalsToAdd = newGoals.filter(
        (goal) => !existingKeys.has(getGoalKey(goal))
      );
      return goalsToAdd.length > 0 ? [...goalsToAdd, ...oldGoals] : oldGoals;
    });
    setOperator(null);
  };

  return (
    <Layout page="/planner">
      <Grid container mb={2}>
        <Grid item xs={4}>
          <OperatorSearch
            value={operator}
            onChange={(newOp) => setOperator(newOp)}
          />
        </Grid>
        <Grid item xs={8}>
          <GoalSelect operator={operator} onGoalsAdded={handleGoalsAdded} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={7}>
          <MaterialsNeeded
            depot={depot}
            setDepot={setDepot}
            crafting={crafting}
            setCrafting={setCrafting}
            goals={goals}
          />
        </Grid>
        <Grid item xs={5}>
          <PlannerGoals goals={goals} setGoals={setGoals} />
        </Grid>
      </Grid>
    </Layout>
  );
};
export default Planner;
