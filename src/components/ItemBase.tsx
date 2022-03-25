import { Box, SxProps, Theme } from "@mui/material";
import Image from "next/image";

import items from "../../data/items.json";
import * as Output from "../../scripts/output-types";

const DEFAULT_SIZE = 100;

export interface ItemBaseProps {
  itemId: string;
  size?: number;
  sx?: SxProps<Theme>;
}

const ItemBase: React.FC<ItemBaseProps> = ({
  itemId,
  size = DEFAULT_SIZE,
  sx,
  children,
}) => {
  const item: Output.Item = items[itemId as keyof typeof items];
  const bgSize = Math.floor(size * (95 / 100));
  return (
    <Box
      sx={{
        display: "inline-grid",
        "& > *": {
          gridArea: "1 / -1",
        },
        ...(sx ?? {}),
      }}
    >
      <Image
        src={`/images/items/itembg-tier-${item.tier}.png`}
        width={bgSize}
        height={bgSize}
        alt=""
      />
      <Image
        src={`/images/items/${item.iconId}.png`}
        alt={item.name}
        width={size}
        height={size}
        objectFit="contain"
      />
      {children}
    </Box>
  );
};
export default ItemBase;
