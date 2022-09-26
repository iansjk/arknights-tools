import { Box, SxProps, Theme } from "@mui/material";
import Image from "next/image";
import React from "react";

import items from "../../data/items.json";
import * as Output from "../../scripts/output-types";

const DEFAULT_SIZE = 100;

export interface ItemBaseProps {
  itemId: string;
  size?: number;
  sx?: SxProps<Theme>;
}

const ItemBase = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ItemBaseProps>
>((props, ref) => {
  const { itemId, size = DEFAULT_SIZE, sx, children, ...rest } = props;
  const item: Output.Item = items[itemId as keyof typeof items];
  const bgSize = Math.floor(size * (95 / 100));
  return (
    <Box
      ref={ref}
      sx={{
        display: "inline-grid",
        "& > *": {
          gridArea: "1 / -1",
        },
        ...(sx ?? {}),
      }}
      {...rest}
    >
      <Image
        src={`/arknights/item-bgs/tier${item.tier}`}
        width={bgSize}
        height={bgSize}
        alt=""
      />
      <Image
        src={`/arknights/items/${item.iconId}`}
        alt={item.name}
        width={size}
        height={size}
        objectFit="contain"
      />
      {children}
    </Box>
  );
});
ItemBase.displayName = "ItemBase";
export default ItemBase;
