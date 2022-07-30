import { Box } from "@mui/material";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { OperatorGoalCategory } from "../../scripts/output-types";

import PlannerGoalCard from "./PlannerGoalCard";

export default {
  title: "Planner/PlannerGoalCard",
  component: PlannerGoalCard,
} as ComponentMeta<typeof PlannerGoalCard>;

const Template: ComponentStory<typeof PlannerGoalCard> = (args) => (
  <Box width="620px">
    <PlannerGoalCard {...args} />
  </Box>
);

export const ShawE1 = Template.bind({});
ShawE1.args = {
  goal: {
    operatorId: "char_277_sqrrel",
    category: OperatorGoalCategory.Elite,
    eliteLevel: 1,
  },
};

export const ChotgunS3M3 = Template.bind({});
ChotgunS3M3.args = {
  goal: {
    operatorId: "char_1013_chen2",
    category: OperatorGoalCategory.Mastery,
    skillId: "skchr_chen2_3",
    masteryLevel: 3,
  },
};

export const PtiloModule = Template.bind({});
PtiloModule.args = {
  goal: {
    operatorId: "char_128_plosis",
    category: OperatorGoalCategory.Module,
    moduleId: "uniequip_002_plosis",
    moduleLevel: 2,
  },
};

export const KroosSk7 = Template.bind({});
KroosSk7.args = {
  goal: {
    operatorId: "char_124_kroos",
    category: OperatorGoalCategory.SkillLevel,
    skillLevel: 7,
  },
};
