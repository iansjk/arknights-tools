import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
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
  const { siteTitle, description, pages } = config;
  const { title: pageTitle, description: pageDescription } = pages[page] ?? {};
  const title = pageTitle ? `${pageTitle} · ${siteTitle}` : siteTitle;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta
          property="og:description"
          content={pageDescription ?? description}
          key="description"
        />
      </Head>

      <AppDrawer mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

      <div>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h2" variant="h5" noWrap>
              {pageTitle ?? siteTitle}
            </Typography>
          </Toolbar>
        </AppBar>

        <Container component="main" maxWidth="lg">
          {children}
        </Container>

        <AppFooter />
      </div>
    </div>
  );
};
export default Layout;
