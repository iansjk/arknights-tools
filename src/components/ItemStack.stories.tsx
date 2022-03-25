import { ComponentStory, ComponentMeta } from "@storybook/react";

import ItemStack from "./ItemStack";

export default {
  title: "Planner/ItemStack",
  component: ItemStack,
} as ComponentMeta<typeof ItemStack>;

const Template: ComponentStory<typeof ItemStack> = (args) => (
  <ItemStack {...args} />
);

export const RefinedSolvent = Template.bind({});
RefinedSolvent.args = {
  itemId: "31054",
  quantity: 35,
};

export const LMD = Template.bind({});
LMD.args = {
  itemId: "4001",
  quantity: 999,
};

export const ModuleDataBlock = Template.bind({});
ModuleDataBlock.args = {
  itemId: "mod_unlock_token",
  quantity: 5,
};
