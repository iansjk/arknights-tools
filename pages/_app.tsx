import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";

import createEmotionCache from "../src/createEmotionCache";

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

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

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
