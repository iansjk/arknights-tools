import {
  Checkbox,
  Divider,
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

const PRESETS = new Set([
  "Elite 1 Skill Level 7",
  "Skill 1 Mastery 1 → 3",
  "Skill 2 Mastery 1 → 3",
  "Skill 3 Mastery 1 → 3",
  "Everything",
]);

const GoalMenuCheckboxItem = styled(MenuItem)(({ theme }) => ({
  height: "50px",
  "& .MuiCheckbox-root": {
    marginLeft: theme.spacing(-1),
    marginRight: theme.spacing(0.5),
  },
}));

const GoalMenuPlainItem = styled(MenuItem)(() => ({
  paddingLeft: "25px",
  height: "50px",
}));

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
    const newGoalNames =
      typeof e.target.value === "string" ? [e.target.value] : e.target.value;
    const newSpecificGoals = new Set<string>();
    const newPresets = [];
    for (const goalName of newGoalNames) {
      if (PRESETS.has(goalName)) {
        newPresets.push(goalName);
      } else {
        newSpecificGoals.add(goalName);
      }
    }
    for (const preset of newPresets) {
      switch (preset) {
        case "Elite 1 Skill Level 7":
          newSpecificGoals.add("Elite 1");
          newSpecificGoals.add("Skill Level 2");
          newSpecificGoals.add("Skill Level 3");
          newSpecificGoals.add("Skill Level 4");
          newSpecificGoals.add("Skill Level 5");
          newSpecificGoals.add("Skill Level 6");
          newSpecificGoals.add("Skill Level 7");
          break;
        case "Skill 1 Mastery 1 → 3":
          newSpecificGoals.add("Skill 1 Mastery 1");
          newSpecificGoals.add("Skill 1 Mastery 2");
          newSpecificGoals.add("Skill 1 Mastery 3");
          break;
        case "Skill 2 Mastery 1 → 3":
          newSpecificGoals.add("Skill 2 Mastery 1");
          newSpecificGoals.add("Skill 2 Mastery 2");
          newSpecificGoals.add("Skill 2 Mastery 3");
          break;
        case "Skill 3 Mastery 1 → 3":
          newSpecificGoals.add("Skill 3 Mastery 1");
          newSpecificGoals.add("Skill 3 Mastery 2");
          newSpecificGoals.add("Skill 3 Mastery 3");
          break;
        case "Everything": {
          if (operator!.module != null) {
            newSpecificGoals.add("Module");
          }
          newSpecificGoals.add("Elite 1");
          newSpecificGoals.add("Elite 2");
          newSpecificGoals.add("Skill Level 2");
          newSpecificGoals.add("Skill Level 3");
          newSpecificGoals.add("Skill Level 4");
          newSpecificGoals.add("Skill Level 5");
          newSpecificGoals.add("Skill Level 6");
          newSpecificGoals.add("Skill Level 7");
          newSpecificGoals.add("Skill 1 Mastery 1");
          newSpecificGoals.add("Skill 1 Mastery 2");
          newSpecificGoals.add("Skill 1 Mastery 3");
          newSpecificGoals.add("Skill 2 Mastery 1");
          newSpecificGoals.add("Skill 2 Mastery 2");
          newSpecificGoals.add("Skill 2 Mastery 3");
          newSpecificGoals.add("Skill 3 Mastery 1");
          newSpecificGoals.add("Skill 3 Mastery 2");
          newSpecificGoals.add("Skill 3 Mastery 3");
          break;
        }
        default:
          console.warn("Unknown preset: ", preset);
          break;
      }
    }
    setGoalNames([...newSpecificGoals]);
  };

  const renderOptions = () => {
    if (operator == null) {
      return <MenuItem>Please select an operator first.</MenuItem>;
    }

    const elite =
      operator.elite.length > 0
        ? operator.elite.map((goal) => (
            <GoalMenuCheckboxItem key={goal.name} value={goal.name}>
              <Checkbox
                checked={goalNames.indexOf(goal.name) > -1}
                size="small"
              />
              <ListItemText primary={goal.name} />
            </GoalMenuCheckboxItem>
          ))
        : null;
    const skillLevel =
      operator.skillLevels.length > 0
        ? operator.skillLevels.map((goal) => (
            <GoalMenuCheckboxItem key={goal.name} value={goal.name}>
              <Checkbox
                checked={goalNames.indexOf(goal.name) > -1}
                size="small"
              />
              <ListItemText primary={goal.name} />
            </GoalMenuCheckboxItem>
          ))
        : null;
    const masteryGoals = operator.skills.flatMap((sk) => sk.masteries);
    const mastery =
      masteryGoals.length > 0
        ? masteryGoals.map((goal) => (
            <GoalMenuCheckboxItem key={goal.name} value={goal.name}>
              <Checkbox
                checked={goalNames.indexOf(goal.name) > -1}
                size="small"
              />
              <ListItemText primary={goal.name} />
            </GoalMenuCheckboxItem>
          ))
        : null;

    const module =
      operator.module != null ? (
        <GoalMenuPlainItem key={operator.module.name} value="Module">
          Module
        </GoalMenuPlainItem>
      ) : null;

    const presets = [
      <ListSubheader key="presets">Presets</ListSubheader>,
      <GoalMenuPlainItem
        key="Elite 1 Skill Level 7"
        value="Elite 1 Skill Level 7"
      >
        Elite 1 Skill Level 7
      </GoalMenuPlainItem>,
      ...operator.skills
        .filter((sk) => sk.masteries.length > 0)
        .map((_, i) => {
          const masteryPresetName = `Skill ${i + 1} Mastery 1 → 3`;
          return (
            <GoalMenuPlainItem
              key={masteryPresetName}
              value={masteryPresetName}
            >
              {masteryPresetName}
            </GoalMenuPlainItem>
          );
        }),
      <GoalMenuPlainItem key="Everything" value="Everything">
        Everything
      </GoalMenuPlainItem>,
      <ListSubheader key="goals">Goals</ListSubheader>,
    ];

    const options = [...presets];
    if (module != null) {
      options.push(module);
      options.push(<Divider key="1" />);
    }
    if (elite) {
      options.push(...elite);
    }
    if (skillLevel) {
      options.push(<Divider key="2" />);
      options.push(...skillLevel);
    }
    if (mastery) {
      options.push(<Divider key="3" />);
      options.push(...mastery);
    }
    return options;
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
