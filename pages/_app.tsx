import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";

import "../styles/globals.css";

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const siteMetadata = {
  siteTitle: "Arknights Tools",
  siteUrl: "https://samidare.io/arknights",
  description:
    "A collection of tools for Arknights, a tower defense mobile game by Hypergryph/Yostar",
  pages: {
    "/planner": {
      title: "Operator Planner",
      description: "Track material requirements for your operator goals",
    },
    "/recruitment": {
      title: "Recruitment Calculator",
      description:
        "See what operators can be obtained from your recruitment tags",
    },
    "/gacha": {
      title: "Pull Probability Calculator",
      description:
        "Calculate probabilities for obtaining units from a gacha banner",
    },
    "/leveling": {
      title: "Leveling Costs",
      description: "Show LMD and XP costs for leveling operators",
    },
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
