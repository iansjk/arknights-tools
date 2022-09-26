import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

import levelingJson from "../../../data/leveling.json";
import { Operator } from "../../../scripts/output-types";
import Layout from "../../components/Layout";
import OperatorSearch from "../../components/OperatorSearch";
import ValidatedTextField from "../../components/ValidatedTextField";

interface LevelingCost {
  exp: number;
  lmd: number;
  levelingLmd: number;
  eliteLmd: number;
}

const levelingCost = (
  rarity: number,
  startingElite: number,
  startingLevel: number,
  targetElite: number,
  targetLevel: number
): LevelingCost => {
  const costsByElite = Array(Math.max(targetElite - startingElite + 1, 0))
    .fill(0)
    .map((_, i) => {
      const elite = startingElite + i;
      const eliteStartingLevel = elite === startingElite ? startingLevel : 1;
      const eliteTargetLevel =
        elite === targetElite
          ? targetLevel
          : levelingJson.maxLevelByRarity[rarity - 1][elite];
      const exp = levelingJson.expCostByElite[elite]
        .slice(eliteStartingLevel - 1, eliteTargetLevel - 1)
        .reduce((a, b) => a + b, 0);
      const levelingLmd = levelingJson.lmdCostByElite[elite]
        .slice(eliteStartingLevel - 1, eliteTargetLevel - 1)
        .reduce((a, b) => a + b, 0);
      const eliteLmd =
        elite === startingElite
          ? 0
          : levelingJson.eliteLmdCost[rarity - 1][elite - 1];
      return {
        exp,
        lmd: levelingLmd + eliteLmd,
        eliteLmd,
        levelingLmd,
      };
    });
  const initialValue = {
    exp: 0,
    lmd: 0,
    eliteLmd: 0,
    levelingLmd: 0,
  };
  return costsByElite.reduce(
    (a, b) => ({
      exp: a.exp + b.exp,
      lmd: a.lmd + b.lmd,
      eliteLmd: a.eliteLmd + b.eliteLmd,
      levelingLmd: a.levelingLmd + b.levelingLmd,
    }),
    initialValue
  );
};

const maxElite = (rarity: number | undefined) => {
  if (rarity == null) {
    return 0;
  }
  switch (rarity) {
    case 1:
    case 2:
      return 0;
    case 3:
      return 1;
    default:
      return 2;
  }
};

const maxLevel = (rarity: number | undefined, elite: number | undefined) => {
  if (rarity == null || elite == null) {
    return 0;
  }
  return levelingJson.maxLevelByRarity[rarity - 1][elite];
};

const Leveling: NextPage = () => {
  const [operator, setOperator] = useState<Operator | null>(null);
  const [startingElite, setStartingElite] = useState(0);
  const [startingLevel, setStartingLevel] = useState(1);
  const [targetElite, setTargetElite] = useState(0);
  const [targetLevel, setTargetLevel] = useState(1);
  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const { exp, lmd, levelingLmd, eliteLmd } = operator
    ? levelingCost(
        operator.rarity,
        startingElite,
        startingLevel,
        targetElite,
        targetLevel
      )
    : { exp: 0, lmd: 0, levelingLmd: 0, eliteLmd: 0 };
  const maxStartingLevel = maxLevel(operator?.rarity, startingElite);
  const maxTargetLevel = maxLevel(operator?.rarity, targetElite);
  const startingLevelHelpText = operator
    ? `Between 1 and ${maxStartingLevel}`
    : "";
  const targetLevelHelpText = operator ? `Between 1 and ${maxTargetLevel}` : "";

  const handleChange = (op: Operator | null) => {
    setOperator(op);
    if (op != null) {
      const newMaxElite = maxElite(op.rarity);
      if (startingElite > newMaxElite) {
        setStartingElite(newMaxElite);
        setStartingLevel(1);
      }
      if (targetElite > newMaxElite) {
        setTargetElite(newMaxElite);
        setTargetLevel(1);
      }
    }
  };

  const handleChangeStartingElite = (e: SelectChangeEvent<number>) => {
    const newStartingElite = Number(e.target.value);
    setStartingElite(newStartingElite);
    if (targetElite < newStartingElite) {
      setTargetElite(newStartingElite);
    }
  };

  const sectionStyle = {
    px: 2,
    pt: 2,
    pb: operator != null ? 2 : 3,
  };

  return (
    <Layout page="/leveling">
      <Box display="flex" justifyContent="center">
        <Grid container spacing={2} sx={{ maxWidth: "800px" }}>
          <Grid item xs={12}>
            <OperatorSearch value={operator} onChange={handleChange} />
          </Grid>
          <Grid
            item
            xs={12}
            container
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} sm={5}>
              <Paper elevation={3} component="section" sx={sectionStyle}>
                <Typography component="h3" variant="h5" sx={{ mb: 2 }}>
                  Start point
                </Typography>
                <Box display="flex" flexDirection="row">
                  <OperatorImage
                    operator={operator}
                    eliteLevel={startingElite}
                  />
                  <div>
                    <FormControl
                      size="small"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    >
                      <InputLabel htmlFor="starting-elite">
                        Starting elite
                      </InputLabel>
                      <Select<number>
                        disabled={!operator}
                        native
                        value={startingElite}
                        label="Starting elite"
                        onChange={handleChangeStartingElite}
                        inputProps={{
                          name: "starting-elite",
                          id: "starting-elite",
                        }}
                      >
                        <option value={0}>Elite 0</option>
                        {Array(maxElite(operator?.rarity))
                          .fill(0)
                          .map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Elite {i + 1}
                            </option>
                          ))}
                      </Select>
                    </FormControl>
                    <ValidatedTextField
                      size="small"
                      fullWidth
                      disabled={!operator}
                      id="starting-level"
                      label="Starting level"
                      type="numeric"
                      defaultValue={startingLevel}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) =>
                        setStartingLevel(parseInt(e.target.value, 10))
                      }
                      revalidateOn={[startingElite]}
                      validator={(value) => {
                        if (!operator) {
                          return true;
                        }
                        const numericValue = parseInt(value, 10);
                        return (
                          !Number.isNaN(numericValue) &&
                          numericValue >= 1 &&
                          numericValue <= maxStartingLevel
                        );
                      }}
                      helperText={startingLevelHelpText}
                    />
                  </div>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={2}>
              {!isXSmallScreen ? (
                <TrendingFlatIcon
                  sx={{
                    fontSize: "3rem",
                    color: "rgba(255, 255, 255, 0.8)",
                    stroke: "black",
                    strokeWidth: "0.2px",
                    width: "100%",
                  }}
                />
              ) : (
                <>&nbsp;</>
              )}
            </Grid>
            <Grid item xs={12} sm={5}>
              <Paper elevation={3} component="section" sx={sectionStyle}>
                <Typography component="h3" variant="h5" sx={{ mb: 2 }}>
                  End point
                </Typography>
                <Box display="flex" flexDirection="row">
                  <OperatorImage operator={operator} eliteLevel={targetElite} />
                  <div>
                    <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                      <InputLabel htmlFor="target-elite">
                        Target elite
                      </InputLabel>
                      <Select
                        disabled={!operator}
                        native
                        value={targetElite}
                        label="Target elite"
                        onChange={(e) => {
                          setTargetElite(
                            parseInt(e.target.value as string, 10)
                          );
                        }}
                        inputProps={{
                          name: "target-elite",
                          id: "target-elite",
                        }}
                      >
                        <option value={0}>Elite 0</option>
                        {Array(maxElite(operator?.rarity))
                          .fill(0)
                          .map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Elite {i + 1}
                            </option>
                          ))}
                      </Select>
                    </FormControl>
                    <ValidatedTextField
                      size="small"
                      fullWidth
                      disabled={!operator}
                      id="target-level"
                      label="Target level"
                      type="numeric"
                      defaultValue={targetLevel}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) =>
                        setTargetLevel(parseInt(e.target.value, 10))
                      }
                      revalidateOn={[targetElite]}
                      validator={(value) => {
                        if (!operator) {
                          return true;
                        }
                        const numericValue = parseInt(value, 10);
                        return (
                          !Number.isNaN(numericValue) &&
                          numericValue >= 1 &&
                          numericValue <= maxTargetLevel
                        );
                      }}
                      helperText={targetLevelHelpText}
                    />
                  </div>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper
              elevation={3}
              component="section"
              sx={{ px: 2, pt: 2, pb: 3 }}
            >
              <Typography component="h3" variant="h5" gutterBottom>
                Costs
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
                <Typography variant="body1" component="li">
                  Total EXP cost:{" "}
                  <span>
                    <strong>{exp.toLocaleString()}</strong> EXP
                  </span>
                </Typography>
                <Typography variant="body1" component="li" sx={{ mt: 1 }}>
                  Total LMD cost:{" "}
                  <span>
                    <strong data-cy="lmd" data-lmd={lmd}>
                      {lmd.toLocaleString()}
                    </strong>{" "}
                    <LmdIcon />
                  </span>
                  <Box
                    component="ul"
                    sx={{
                      mt: 1,
                      "& > li": { display: "list-item", listStyle: "disc" },
                      "& > li ~ li": { mt: 1 },
                    }}
                  >
                    <Typography variant="body1" component="li">
                      LMD cost for leveling:{" "}
                      <span>
                        <span
                          data-cy="levelingLmd"
                          data-leveling-lmd={levelingLmd}
                        >
                          {levelingLmd.toLocaleString()}
                        </span>{" "}
                      </span>
                    </Typography>
                    <Typography variant="body1" component="li">
                      LMD cost for elite promotions:{" "}
                      <span>
                        <span>{eliteLmd.toLocaleString()}</span> <LmdIcon />
                      </span>
                    </Typography>
                  </Box>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};
export default Leveling;

const LmdIcon: React.FC = () => {
  return (
    <Box component="span" position="relative" top={3}>
      <Image src="/arknights/lmd-icon" width={26} height={18} alt="LMD" />
    </Box>
  );
};

const OperatorImage: React.FC<{
  operator: Operator | null;
  eliteLevel?: number;
}> = ({ operator, eliteLevel = 0 }) => {
  const imageSrc = `/arknights/${
    operator
      ? `avatars/${operator.id}${
          eliteLevel === 2 || (eliteLevel > 0 && operator.name === "Amiya")
            ? `_${
                eliteLevel === 1 && operator.name === "Amiya"
                  ? `1+`
                  : eliteLevel
              }.png`
            : ""
        }`
      : "no-operator"
  }`;
  return (
    <Box
      border="1px solid #c0c0c0"
      mr={2}
      width={100}
      height={100}
      flexShrink={0}
      display="grid"
      gridTemplateAreas="'x'"
      sx={{
        "& > *": {
          gridArea: "x",
        },
      }}
    >
      <Image
        // force remounting with explicit key prop
        key={`${
          operator ? `${operator.id}-${eliteLevel ?? 0}` : "no-operator"
        }`}
        src={imageSrc}
        width={100}
        height={100}
        alt={
          operator
            ? `${operator.name}${eliteLevel ? ` Elite ${eliteLevel}` : ""}`
            : "No operator"
        }
      />
      {operator != null && (
        <Box alignSelf="end" justifySelf="end" lineHeight={1}>
          <Image
            src={`/arknights/elite/${eliteLevel ?? 0}`}
            width={35}
            height={35}
            alt={`Elite ${eliteLevel ?? 0}`}
          />
        </Box>
      )}
    </Box>
  );
};
