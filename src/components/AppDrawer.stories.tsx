import { ComponentStory, ComponentMeta } from "@storybook/react";

import AppDrawer from "./AppDrawer";

export default {
  title: "AppDrawer",
  component: AppDrawer,
} as ComponentMeta<typeof AppDrawer>;

const Template: ComponentStory<typeof AppDrawer> = (args) => (
  <AppDrawer {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
