import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import config from "../config";
import createEmotionCache from "../createEmotionCache";
import { pageview, NEXT_PUBLIC_GOOGLE_ANALYTICS_ID } from "../gtag";
import { store, persistor } from "../store/store";
import theme from "../theme";

import "../styles/global.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const isProductionEnvironment = process.env.NODE_ENV === "production";

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { siteTitle, siteDescription, siteUrl } = config;

  // pass route change events to Google Analytics
  // from https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_app.js
  const router = useRouter();

  useEffect(() => {
    let handleRouteChange: ((url: URL) => void) | null = null;
    if (isProductionEnvironment) {
      handleRouteChange = (url: URL) => {
        pageview(url);
      };
      router.events.on("routeChangeComplete", handleRouteChange);
    }
    return () => {
      if (handleRouteChange != null) {
        router.events.off("routeChangeComplete", handleRouteChange);
      }
    };
  }, [router.events]);

  return (
    <ReduxProvider store={store}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
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
            <meta key="ogTitle" property="og:title" content={siteTitle} />
            <meta key="ogUrl" property="og:url" content={siteUrl} />
            <meta
              key="description"
              name="description"
              content={siteDescription}
            />
            <meta
              key="ogDescription"
              property="og:description"
              content={siteDescription}
            />
          </Head>

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          {/* from https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_app.js */}
          {isProductionEnvironment && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
              />
              <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
                }}
              />
            </>
          )}

          <CssBaseline />

          <PersistGate loading={null} persistor={persistor}>
            {() => <Component {...pageProps} />}
          </PersistGate>
        </ThemeProvider>
      </CacheProvider>
    </ReduxProvider>
  );
}
