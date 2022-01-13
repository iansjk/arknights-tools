import { Box, styled, Typography } from "@mui/material";
import React from "react";

const FooterListItem = styled("li")(({ theme }) => ({
  display: "inline-block",
  position: "relative",
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  "&::after, &::before": {
    content: '"\u00b7"',
    position: "absolute",
    top: 0,
    fontSize: "1rem",
  },
  "&::before": {
    left: "-2px",
  },
  "&::after": {
    right: "-2px",
  },
  "&.longer-list-item": {
    fontSize: `min(3.05vw, ${theme.typography.body2.fontSize})`,
  },
}));

const FooterLink = styled("a")(({ theme }) => ({
  color: theme.palette.primary.light,
}));

const DiscordTag = styled("code")(({ theme }) => ({
  fontSize: theme.typography.fontSize,
}));

const AppFooter: React.VFC = () => {
  return (
    <Typography
      component="footer"
      variant="body2"
      sx={{
        background: "background.paper",
        maxWidth: "100%",
        marginTop: 4,
        flexShrink: 0,
      }}
    >
      <Box component="ul" textAlign="center" paddingLeft={0}>
        <FooterListItem>
          site made by{" "}
          <DiscordTag>
            samidare
            <span role="img" aria-label="umbrella">
              ☔
            </span>
            #3333
          </DiscordTag>
        </FooterListItem>

        <FooterListItem>
          game data:&nbsp;
          <FooterLink
            href="https://github.com/Kengxxiao/ArknightsGameData"
            target="_blank"
            rel="noreferrer noopener"
          >
            Kengxxiao
          </FooterLink>
        </FooterListItem>

        <FooterListItem>
          images:&nbsp;
          <FooterLink
            href="https://github.com/Aceship/AN-EN-Tags"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aceship
          </FooterLink>
        </FooterListItem>

        <FooterListItem>
          stage data:&nbsp;
          <FooterLink
            href="https://penguin-stats.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Penguin Statistics
          </FooterLink>
        </FooterListItem>

        <FooterListItem className="longer-list-item">
          efficiency and pull probability calculations:&nbsp;
          <DiscordTag>Luzark#8152</DiscordTag>
        </FooterListItem>

        <FooterListItem>
          <Typography variant="body2">
            favicon:&nbsp;
            <FooterLink
              href="https://discord.com/invite/arknights"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Arknights Discord
            </FooterLink>
          </Typography>
        </FooterListItem>

        <FooterListItem>Arknights is &copy; Hypergryph/Yostar</FooterListItem>

        <FooterListItem className="longer-list-item">
          this project is unaffiliated with Arknights&apos;
          creators/distributors
        </FooterListItem>
      </Box>
    </Typography>
  );
};
export default AppFooter;
