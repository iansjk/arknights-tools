import {
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { siteMetadata } from "../pages/_app";

interface Props {
  mobileOpen: boolean;
  onClose: () => void;
}

const AppDrawer: React.VFC<Props> = (props) => {
  const { mobileOpen, onClose } = props;
  const { siteTitle, siteUrl, pages } = siteMetadata;
  const container = typeof window !== "undefined" ? document.body : undefined;

  const drawerContent = (
    <>
      <Typography component="h1" variant="h5">
        <Link href={siteUrl}>{siteTitle}</Link>
      </Typography>
      <Divider />
      <List>
        {pages.map(({ slug, pageTitle }) => (
          <ListItem key={slug} button>
            <ListItemText primary={pageTitle} />
          </ListItem>
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
          onClose={onClose}
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
