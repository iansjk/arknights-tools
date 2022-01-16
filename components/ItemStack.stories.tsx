import { ComponentStory, ComponentMeta } from "@storybook/react";

import ItemStack from "./ItemStack";

export default {
  title: "Planner/ItemStack",
  component: ItemStack,
} as ComponentMeta<typeof ItemStack>;

const Template: ComponentStory<typeof ItemStack> = (args) => (
  <ItemStack {...args} />
);

export const SeminaturalSolvent = Template.bind({});
SeminaturalSolvent.args = {
  id: "31053",
  quantity: 35,
};

export const LMD = Template.bind({});
LMD.args = {
  id: "4001",
  quantity: 999,
};

export const ModuleDataBlock = Template.bind({});
ModuleDataBlock.args = {
  id: "mod_unlock_token",
  quantity: 5,
};
