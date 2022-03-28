import { Grid } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

import { Operator } from "../../../scripts/output-types";
import GoalSelect from "../../components/GoalSelect";
import Layout from "../../components/Layout";
import MaterialsNeeded from "../../components/MaterialsNeeded";
import OperatorSearch from "../../components/OperatorSearch";
import PlannerGoals from "../../components/PlannerGoals";
import { addGoals, PlannerGoal } from "../../store/goalsSlice";
import { useAppDispatch } from "../../store/hooks";

const Planner: NextPage = () => {
  const [operator, setOperator] = useState<Operator | null>(null);
  const dispatch = useAppDispatch();

  const handleGoalsAdded = (newGoals: PlannerGoal[]) => {
    dispatch(addGoals(newGoals));
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
          <MaterialsNeeded />
        </Grid>
        <Grid item xs={5}>
          <PlannerGoals />
        </Grid>
      </Grid>
    </Layout>
  );
};
export default Planner;
