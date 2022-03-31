import { Popover, Typography } from "@mui/material";
import React from "react";

import itemsJson from "../../../data/items.json";
import { Item } from "../../../scripts/output-types";

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
      {itemId != null && item != null && <Typography>{item.name}</Typography>}
    </Popover>
  );
});
ItemInfoPopover.displayName = "ItemInfoPopover";
export default ItemInfoPopover;
