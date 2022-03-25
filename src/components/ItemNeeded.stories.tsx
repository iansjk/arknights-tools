import { ComponentStory, ComponentMeta } from "@storybook/react";

import ItemNeeded from "./ItemNeeded";

export default {
  title: "Planner/ItemNeeded",
  component: ItemNeeded,
} as ComponentMeta<typeof ItemNeeded>;

const Template: ComponentStory<typeof ItemNeeded> = (args) => (
  <ItemNeeded {...args} />
);

export const RefinedSolvent = Template.bind({});
RefinedSolvent.args = {
  itemId: "31054",
  quantity: 35,
  owned: 0,
  isCrafting: true,
};

export const LMD = Template.bind({});
LMD.args = {
  itemId: "4001",
  quantity: 999,
  owned: 0,
};

export const ModuleDataBlock = Template.bind({});
ModuleDataBlock.args = {
  itemId: "mod_unlock_token",
  quantity: 5,
  owned: 0,
};
