import React from "react";
import { makeStyles, Container, Link, Typography } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  footer: {
    background: theme.palette.background.paper,
    maxWidth: "100%",
    marginTop: theme.spacing(4),
    flexShrink: 0,
  },
  footerLink: {
    color: theme.palette.primary.light,
  },
  footerList: {
    textAlign: "center",
    paddingLeft: 0,
    "& li": {
      display: "inline-block",
      position: "relative",
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    "& li::after, & li::before": {
      content: '"\u00b7"',
      position: "absolute",
      top: 0,
      fontSize: "1rem",
    },
    "& li::before": {
      left: "-2px",
    },
    "& li::after": {
      right: "-2px",
    },
  },
  longerListItem: {
    fontSize: `min(3.05vw, ${theme.typography.body2.fontSize})`,
  },
  discordTag: {
    fontSize: theme.typography.fontSize,
  },
}));

export default function AppFooter({ className }): React.ReactElement {
  const classes = useStyles();

  return (
    <Container
      component="footer"
      className={className ? clsx(className, classes.footer) : classes.footer}
    >
      <ul className={classes.footerList}>
        <li>
          <Typography variant="body2">
            site made by&nbsp;
            <code className={classes.discordTag}>
              samidare&nbsp;
              <span role="img" aria-label="umbrella">
                ☔
              </span>
              #5449
            </code>
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            game data:&nbsp;
            <Link
              className={classes.footerLink}
              href="https://github.com/Kengxxiao/ArknightsGameData"
              target="_blank"
              rel="noopener"
              variant="inherit"
            >
              Kengxxiao
            </Link>
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            images:&nbsp;
            <Link
              className={classes.footerLink}
              href="https://github.com/Aceship/AN-EN-Tags"
              target="_blank"
              rel="noopener"
              variant="inherit"
            >
              Aceship
            </Link>
          </Typography>
        </li>
        <li>
          stage data:&nbsp;
          <Link
            className={classes.footerLink}
            href="https://penguin-stats.io/"
            target="_blank"
            rel="noopener"
          >
            Penguin Statistics
          </Link>
        </li>
        <li>
          <Typography variant="body2" className={classes.longerListItem}>
            efficiency and pull probability calculations:&nbsp;
            <code className={classes.discordTag}>Luzark#8152</code>
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            favicon:&nbsp;
            <Link
              className={classes.footerLink}
              href="https://discord.com/invite/arknights"
              target="_blank"
              rel="noopener"
              variant="inherit"
            >
              Official Arknights Discord
            </Link>
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Arknights is &copy; Hypergryph/Yostar
          </Typography>
        </li>
        <li>
          <Typography className={classes.longerListItem} variant="body2">
            this project is unaffiliated with Arknights&apos;
            creators/distributors
          </Typography>
        </li>
      </ul>
    </Container>
  );
}
