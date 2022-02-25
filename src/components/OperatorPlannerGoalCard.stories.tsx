import { ComponentStory, ComponentMeta } from "@storybook/react";

import OperatorPlannerGoalCard from "./OperatorPlannerGoalCard";

export default {
  title: "Planner/OperatorGoalCard",
  component: OperatorPlannerGoalCard,
} as ComponentMeta<typeof OperatorPlannerGoalCard>;

const Template: ComponentStory<typeof OperatorPlannerGoalCard> = (args) => (
  <OperatorPlannerGoalCard {...args} />
);

export const ChenAlterE2S3M3 = Template.bind({});
ChenAlterE2S3M3.args = {
  operatorId: "char_1013_chen2",
  elite: {
    start: 0,
    end: 2,
  },
  skillLevel: {
    start: 1,
    end: 7,
  },
  masteries: {
    "3": {
      start: 0,
      end: 3,
    },
  },
};

export const LaPlumaE2Sk7 = Template.bind({});
LaPlumaE2Sk7.args = {
  operatorId: "char_421_crow",
  elite: {
    start: 0,
    end: 2,
  },
  skillLevel: {
    start: 1,
    end: 7,
  },
};

export const ManticoreS1M0ToS1M3 = Template.bind({});
ManticoreS1M0ToS1M3.args = {
  operatorId: "char_215_mantic",
  masteries: {
    "1": {
      start: 0,
      end: 3,
    },
  },
};

export const MostiE1ToE2AndSk4ToSk7 = Template.bind({});
MostiE1ToE2AndSk4ToSk7.args = {
  operatorId: "char_213_mostma",
  elite: {
    start: 0,
    end: 2,
  },
  skillLevel: {
    start: 4,
    end: 7,
  },
};
