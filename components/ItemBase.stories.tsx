import { ComponentStory, ComponentMeta } from "@storybook/react";

import ItemBase from "./ItemBase";

export default {
  title: "Planner/ItemBase",

  component: ItemBase,
} as ComponentMeta<typeof ItemBase>;

const Template: ComponentStory<typeof ItemBase> = (args) => (
  <ItemBase {...args} />
);

export const SeminaturalSolvent = Template.bind({});
SeminaturalSolvent.args = {
  id: "31053",
};

export const LMD = Template.bind({});
LMD.args = {
  id: "4001",
};

export const ModuleDataBlock = Template.bind({});
ModuleDataBlock.args = {
  id: "mod_unlock_token",
};
