import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Box,
} from "@mui/material";
import Head from "next/head";
import * as React from "react";

import config from "../config";

import AppDrawer from "./AppDrawer";
import AppFooter from "./AppFooter";

interface Props {
  page: keyof typeof config.pages;
}

const Layout: React.FC<Props> = (props) => {
  const { page, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { siteTitle, pages } = config;
  const { title: pageTitle, description: pageDescription } = pages[page] ?? {};
  const title = pageTitle ? `${pageTitle} · ${siteTitle}` : siteTitle;

  const handleDrawerToggle = React.useCallback(() => {
    setMobileOpen((open) => !open);
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          key="ogUrl"
          property="og:url"
          content={`${config.siteUrl}${page}`}
        />
        {pageTitle && (
          <meta key="ogTitle" property="og:title" content={pageTitle} />
        )}
        {pageDescription && (
          <>
            <meta
              key="description"
              name="description"
              content={pageDescription}
            />
            <meta
              key="ogDescription"
              property="og:description"
              content={pageDescription}
            />
          </>
        )}
      </Head>

      <Box
        display="grid"
        height="100vh"
        gridTemplateAreas={'"drawer header" "drawer main" "drawer footer"'}
        gridTemplateRows="auto 1fr auto"
        gridTemplateColumns="auto 1fr"
      >
        <AppDrawer
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
        />

        <AppBar position="sticky" enableColorOnDark sx={{ gridArea: "header" }}>
          <Toolbar>
            <IconButton
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: {
                  xl: "none",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h2" variant="h5" noWrap>
              {pageTitle}
            </Typography>
          </Toolbar>
        </AppBar>

        <Container
          component="main"
          maxWidth="xl"
          sx={{ gridArea: "main", p: 2 }}
        >
          {children}
        </Container>

        <AppFooter />
      </Box>
    </>
  );
};
export default Layout;
