import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material";

import "../styles/globals.css";

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
