import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";

import { Operator } from "../../scripts/output-types";

const GoalMenuItem = styled(MenuItem)`
  pr: "15px";
`;

interface Props {
  operator: Operator | null;
}

const GoalSelect: React.VFC<Props> = (props) => {
  const { operator } = props;
  const [goalNames, setGoalNames] = useState<string[]>([]);

  useEffect(() => {
    setGoalNames([]);
  }, [operator]);

  const handleChange = (e: SelectChangeEvent<string[]>) => {
    setGoalNames(
      typeof e.target.value === "string" ? [e.target.value] : e.target.value
    );
  };

  const renderOptions = () => {
    if (operator == null) {
      return <MenuItem>Please select an operator first.</MenuItem>;
    }

    const elite =
      operator.elite.length > 0
        ? [
            <ListSubheader key="elite">Elite</ListSubheader>,
            ...operator.elite.map((goal) => (
              <GoalMenuItem key={goal.name} value={goal.name}>
                <Checkbox
                  checked={goalNames.indexOf(goal.name) > -1}
                  size="small"
                />
                <ListItemText primary={goal.name} />
              </GoalMenuItem>
            )),
          ]
        : [];
    const skillLevel =
      operator.skillLevels.length > 0
        ? [
            <ListSubheader key="skillLevels">Skill Levels</ListSubheader>,
            ...operator.skillLevels.map((goal) => (
              <GoalMenuItem key={goal.name} value={goal.name}>
                <Checkbox
                  checked={goalNames.indexOf(goal.name) > -1}
                  size="small"
                />
                <ListItemText primary={goal.name} />
              </GoalMenuItem>
            )),
          ]
        : [];
    const masteryGoals = operator.skills.flatMap((sk) => sk.masteries);
    const mastery =
      masteryGoals.length > 0
        ? [
            <ListSubheader key="masteries">Masteries</ListSubheader>,
            ...masteryGoals.map((goal) => (
              <GoalMenuItem key={goal.name} value={goal.name}>
                <Checkbox
                  checked={goalNames.indexOf(goal.name) > -1}
                  size="small"
                />
                <ListItemText primary={goal.name} />
              </GoalMenuItem>
            )),
          ]
        : [];

    const module =
      operator.module != null ? (
        <GoalMenuItem
          key={operator.module.name}
          value="Module"
          sx={{
            pl: "25px",
            height: "50px",
          }}
        >
          Module
        </GoalMenuItem>
      ) : null;

    return module != null
      ? [module, ...elite, ...skillLevel, ...mastery]
      : [...elite, ...skillLevel, ...mastery];
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor="goal-select">Goals</InputLabel>
      <Select
        id="goal-select"
        name="goal-select"
        autoWidth
        multiple
        displayEmpty
        value={goalNames}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          sx: { "& .MuiList-root": { mr: "25px", width: "100%" } },
        }}
        renderValue={(selected) =>
          selected.sort((a, b) => a.localeCompare(b)).join(", ")
        }
        onChange={handleChange}
      >
        {renderOptions()}
      </Select>
    </FormControl>
  );
};
export default GoalSelect;
