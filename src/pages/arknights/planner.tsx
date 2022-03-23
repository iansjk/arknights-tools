import { Grid } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

import { Operator, OperatorGoal } from "../../../scripts/output-types";
import GoalSelect from "../../components/GoalSelect";
import Layout from "../../components/Layout";
import MaterialsNeeded from "../../components/MaterialsNeeded";
import OperatorGoals from "../../components/OperatorGoals";
import OperatorSearch from "../../components/OperatorSearch";

const Planner: NextPage = () => {
  const [operator, setOperator] = useState<Operator | null>(null);
  const [goals, setGoals] = useState<OperatorGoal[]>([]);

  const handleGoalsAdded = (goals: OperatorGoal[]) => {
    setGoals(goals);
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
        <Grid item xs={7}>
          <MaterialsNeeded />
        </Grid>
        <Grid item xs={5}>
          <OperatorGoals />
        </Grid>
      </Grid>
    </Layout>
  );
};
export default Planner;
