module.exports = {
  stories: ["../src/components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/react",
  core: {
    builder: "webpack5",
  },
  // see https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#emotion11-quasi-compatibility
  features: {
    emotionAlias: false,
  },
  staticDirs: ["../public"],
};
