import { Grid } from "@mui/material";
import { NextPage } from "next";
import React, { Suspense, useState } from "react";

import { Operator } from "../../../scripts/output-types";
import GoalSelect from "../../components/GoalSelect";
import Layout from "../../components/Layout";
import OperatorSearch from "../../components/OperatorSearch";
import { addGoals, PlannerGoal } from "../../store/goalsSlice";
import { useAppDispatch } from "../../store/hooks";

const MaterialsNeeded = React.lazy(
  () => import("../../components/MaterialsNeeded")
);
const PlannerGoals = React.lazy(() => import("../../components/PlannerGoals"));

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
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            pr: {
              xs: 0,
              md: 1,
            },
          }}
        >
          <OperatorSearch
            value={operator}
            onChange={(newOp) => setOperator(newOp)}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            mt: {
              xs: 1,
              md: 0,
            },
          }}
        >
          <GoalSelect operator={operator} onGoalsAdded={handleGoalsAdded} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Suspense fallback={null}>
            <MaterialsNeeded />
          </Suspense>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Suspense fallback={null}>
            <PlannerGoals />
          </Suspense>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default Planner;
