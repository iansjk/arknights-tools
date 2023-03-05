import { Alert, AlertTitle, Button, Grid, Link } from "@mui/material";
import lzstring from "lz-string";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { Operator } from "../../../scripts/output-types";
import GoalSelect from "../../components/GoalSelect";
import Layout from "../../components/Layout";
import OperatorSearch from "../../components/OperatorSearch";
import { selectDepot } from "../../store/depotSlice";
import { addGoals, PlannerGoal, selectGoals } from "../../store/goalsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import performLegacyMigration from "../../store/performLegacyMigration";

const MaterialsNeeded = dynamic(
  () => import("../../components/MaterialsNeeded"),
  { ssr: false }
);
const PlannerGoals = dynamic(() => import("../../components/PlannerGoals"), {
  ssr: false,
});

const Planner: NextPage = () => {
  const [operator, setOperator] = useState<Operator | null>(null);
  const dispatch = useAppDispatch();
  const goals = useAppSelector(selectGoals);
  const depot = useAppSelector(selectDepot);

  const handleGoalsAdded = (newGoals: PlannerGoal[]) => {
    dispatch(addGoals(newGoals));
    setOperator(null);
  };

  useEffect(() => {
    try {
      const version = window.localStorage.getItem("version");
      if (version == null || version === "0") {
        dispatch(performLegacyMigration()).then(() => {
          window.localStorage.setItem("version", "1");
        });
      }
    } catch (e) {
      console.error("Failed to migrate old data", e);
    }
  }, [dispatch]);

  const handleMigrationClick = () => {
    const data = { goals, depot };
    const encoded = lzstring.compressToEncodedURIComponent(
      JSON.stringify(data)
    );
    console.log("would send this:", encoded);
    window.location.href = `http://example.com/?data=${encoded}`;
  };

  return (
    <Layout page="/planner">
      <Alert
        severity="warning"
        variant="outlined"
        sx={{ mb: 3, pb: 2, maxWidth: "100ch" }}
      >
        <AlertTitle>Arknights Tools is now part of Krooster</AlertTitle>
        <p>
          Hi everyone, thank you for using samidare.io. Based on my limited free
          time and in order to facilitate more timely updates,{" "}
          <b>
            Arknights Tools has merged with{" "}
            <Link href="https://krooster.com" target="_blank" rel="noreferrer">
              Krooster
            </Link>
          </b>
          , an Arknights collection tracker.
        </p>
        <p>
          This site will continue to be available, but{" "}
          <b>this version on samidare.io won’t receive further updates</b>. If
          you click the button below, your planner data will be copied and
          migrated to Krooster (it won’t be deleted here). Thank you all for
          your support!
        </p>
        <Button
          variant="contained"
          color="warning"
          onClick={handleMigrationClick}
        >
          Migrate Data to Krooster
        </Button>
      </Alert>
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
          <MaterialsNeeded />
        </Grid>
        <Grid item xs={12} lg={5}>
          <PlannerGoals />
        </Grid>
      </Grid>
    </Layout>
  );
};
export default Planner;
