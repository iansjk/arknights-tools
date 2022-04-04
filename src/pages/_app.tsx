import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import config from "../config";
import createEmotionCache from "../createEmotionCache";
import { store, persistor } from "../store/store";
import theme from "../theme";
import "../styles/global.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { siteTitle, siteDescription, siteUrl } = config;

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />

            {/* PWA primary color */}
            <meta name="theme-color" content={theme.palette.primary.main} />

            <link rel="shortcut icon" href="/favicon.ico" />
            <meta charSet="utf-8" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={siteTitle} />
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
