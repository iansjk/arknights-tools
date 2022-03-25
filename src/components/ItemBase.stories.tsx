import { ComponentStory, ComponentMeta } from "@storybook/react";

import ItemBase from "./ItemBase";

export default {
  title: "Planner/ItemBase",

  component: ItemBase,
} as ComponentMeta<typeof ItemBase>;

const Template: ComponentStory<typeof ItemBase> = (args) => (
  <ItemBase {...args} />
);

export const RefinedSolvent = Template.bind({});
RefinedSolvent.args = {
  itemId: "31054",
};

export const LMD = Template.bind({});
LMD.args = {
  itemId: "4001",
};

export const ModuleDataBlock = Template.bind({});
ModuleDataBlock.args = {
  itemId: "mod_unlock_token",
};
