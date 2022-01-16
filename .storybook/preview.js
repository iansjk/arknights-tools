import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "../pages/_app";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  ),
];
