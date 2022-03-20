import { Grid } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

import { Operator } from "../../../scripts/output-types";
import GoalSelect from "../../components/GoalSelect";
import Layout from "../../components/Layout";
import MaterialsNeeded from "../../components/MaterialsNeeded";
import OperatorGoals from "../../components/OperatorGoals";
import OperatorSearch from "../../components/OperatorSearch";

const Planner: NextPage = () => {
  const [operator, setOperator] = useState<Operator | null>(null);

  return (
    <Layout page="/planner">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <OperatorSearch
            value={operator}
            onChange={(newOp) => setOperator(newOp)}
          />
        </Grid>
        <Grid item xs={6}>
          <GoalSelect operator={operator} />
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
