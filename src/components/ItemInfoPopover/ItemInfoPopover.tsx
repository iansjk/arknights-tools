import { Paper, Popover, Typography } from "@mui/material";
import React from "react";

import itemsJson from "../../../data/items.json";
import { Item } from "../../../scripts/output-types";

import CraftingInfo from "./CraftingInfo";
import StageInfo from "./StageInfo";

interface Props {
  itemId: string | null;
  open: boolean;
  onClose: () => void;
}

const ItemInfoPopover: React.VFC<Props> = React.memo((props) => {
  const { itemId, open, onClose } = props;
  const item: Item | null =
    itemId != null ? itemsJson[itemId as keyof typeof itemsJson] : null;
  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={() => document.querySelector(`[data-itemid="${itemId}"]`)!}
      keepMounted
      hideBackdrop={false}
      BackdropProps={{
        invisible: false,
      }}
      anchorOrigin={{
        vertical: "center",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "left",
      }}
      sx={{ opacity: 0.9 }}
    >
      {itemId != null && item != null && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "#000",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{
              display: "inline-block",
              p: 1,
              backgroundColor: (theme) => theme.palette.background.default,
              color: "#fff",
              borderRadius: (theme) => theme.spacing(0.5),
            }}
          >
            {item.name}
          </Typography>
          <CraftingInfo item={item} />
          <StageInfo item={item} />
        </Paper>
      )}
    </Popover>
  );
});
ItemInfoPopover.displayName = "ItemInfoPopover";
export default ItemInfoPopover;
