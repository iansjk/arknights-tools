import {
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import React from "react";

import config from "../config";
import theme from "../theme";
import MigrationModal from "./MigrationModal";

import MuiNextLink from "./MuiNextLink";

const DRAWER_WIDTH_PX = 220;

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const ListItemLink: React.FC<{ href: string; linkText: string }> = ({
  href,
  linkText,
}) => {
  return (
    <ListItem sx={{ p: 0 }}>
      <ListItemButton component={MuiNextLink} href={href}>
        <ListItemText primary={linkText} />
      </ListItemButton>
    </ListItem>
  );
};

interface Props {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

const AppDrawer: React.FC<Props> = React.memo((props) => {
  const { mobileOpen, onDrawerToggle } = props;
  const { siteTitle, siteUrl, pages } = config;
  const container = typeof window !== "undefined" ? document.body : undefined;

  const drawerContent = (
    <>
      <Typography
        component="h1"
        variant="h5"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          pl: 2,
          ...theme.mixins.toolbar,
        }}
      >
        <MuiNextLink
          href={siteUrl}
          sx={{
            color: "inherit",
            textDecoration: "none",
          }}
        >
          {siteTitle}
        </MuiNextLink>
        <Offset />
      </Typography>
      <Divider />
      <List>
        {Object.entries(pages).map(([slug, { title }]) => (
          <ListItemLink
            key={slug}
            href={`/arknights${slug}`}
            linkText={title}
          />
        ))}
      </List>
      <Divider />
      <Typography
        component="h2"
        variant="h6"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          marginTop: "8px",
          ...theme.mixins.toolbar,
        }}
      >
        <MigrationModal />
      </Typography>
    </>
  );

  return (
    <Box
      component="nav"
      gridArea="drawer"
      sx={{
        width: {
          xs: 0,
          xl: `${DRAWER_WIDTH_PX}px`,
        },
      }}
    >
      <Hidden xlUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH_PX,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>

      <Hidden xlDown implementation="css">
        <Drawer
          variant="permanent"
          open
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH_PX,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>
    </Box>
  );
});
AppDrawer.displayName = "AppDrawer";
export default AppDrawer;
