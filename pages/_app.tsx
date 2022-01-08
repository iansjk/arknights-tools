import { createTheme, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";

import "../styles/globals.css";

const theme = createTheme();

export const siteMetadata = {
  siteTitle: "Arknights Tools",
  siteUrl: "https://samidare.io/arknights",
  description:
    "A collection of tools for Arknights, a tower defense mobile game by Hypergryph/Yostar",
  pages: [
    {
      slug: "/planner",
      pageTitle: "Operator Planner",
      description: "Track material requirements for your operator goals",
    },
    {
      slug: "/recruitment",
      pageTitle: "Recruitment Calculator",
      description:
        "See what operators can be obtained from your recruitment tags",
    },
    {
      slug: "/gacha",
      pageTitle: "Pull Probability Calculator",
      description:
        "Calculate probabilities for obtaining units from a gacha banner",
    },
    {
      slug: "/leveling",
      pageTitle: "Leveling Costs",
      description: "Show LMD and XP costs for leveling operators",
    },
  ],
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
