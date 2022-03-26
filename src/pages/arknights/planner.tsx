import { Grid } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

import { Operator } from "../../../scripts/output-types";
import GoalSelect from "../../components/GoalSelect";
import Layout from "../../components/Layout";
import MaterialsNeeded from "../../components/MaterialsNeeded";
import OperatorSearch from "../../components/OperatorSearch";
import PlannerGoals from "../../components/PlannerGoals";
import usePlannerData, { PlannerGoal } from "../../hooks/usePlannerData";

const Planner: NextPage = () => {
  const [operator, setOperator] = useState<Operator | null>(null);
  const { depot, setDepot, crafting, setCrafting, goals, setGoals } =
    usePlannerData();

  const handleGoalsAdded = (newGoals: PlannerGoal[]) => {
    // TODO need to prevent duplicates here
    setGoals((oldGoals) => [...newGoals, ...oldGoals]);
    setOperator(null);
  };

  return (
    <Layout page="/planner">
      <Grid container>
        <Grid item xs={4}>
          <OperatorSearch
            value={operator}
            onChange={(newOp) => setOperator(newOp)}
          />
        </Grid>
        <Grid item xs={8}>
          <GoalSelect operator={operator} onGoalsAdded={handleGoalsAdded} />
        </Grid>
        <Grid item xs={7} p={2}>
          <MaterialsNeeded
            depot={depot}
            setDepot={setDepot}
            crafting={crafting}
            setCrafting={setCrafting}
            goals={goals}
          />
        </Grid>
        <Grid item xs={5} p={2}>
          <PlannerGoals goals={goals} setGoals={setGoals} />
        </Grid>
      </Grid>
    </Layout>
  );
};
export default Planner;
