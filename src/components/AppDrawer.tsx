import {
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

import config from "../config";

import MuiNextLink from "./MuiNextLink";

const ListItemLink: React.VFC<{ href: string; linkText: string }> = ({
  href,
  linkText,
}) => {
  return (
    <ListItem>
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

const AppDrawer: React.VFC<Props> = (props) => {
  const { mobileOpen, onDrawerToggle } = props;
  const { siteTitle, siteUrl, pages } = config;
  const container = typeof window !== "undefined" ? document.body : undefined;

  const drawerContent = (
    <>
      <Typography component="h1" variant="h5">
        <MuiNextLink href={siteUrl}>{siteTitle}</MuiNextLink>
      </Typography>
      <Divider />
      <List>
        {Object.entries(pages).map(([slug, { title }]) => (
          <ListItemLink href={slug} key={slug} linkText={title} />
        ))}
      </List>
    </>
  );

  return (
    <nav>
      <Hidden lgUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>

      <Hidden mdDown implementation="css">
        <Drawer variant="permanent" open>
          {drawerContent}
        </Drawer>
      </Hidden>
    </nav>
  );
};
export default AppDrawer;
