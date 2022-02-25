import { Box } from "@mui/material";

import ItemBase, { ItemBaseProps } from "./ItemBase";

export interface ItemStackProps extends ItemBaseProps {
  quantity: number;
}

const ItemStack: React.VFC<ItemStackProps> = (props) => {
  const { quantity, ...rest } = props;
  return (
    <ItemBase {...rest}>
      <Box
        boxShadow={3}
        sx={{
          py: 0.25,
          px: 1,
          mr: 1,
          mb: 1,
          alignSelf: "end",
          justifySelf: "end",
          background: "rgba(0, 0, 0, 0.75)",
          zIndex: 1,
        }}
      >
        {quantity}
      </Box>
    </ItemBase>
  );
};
export default ItemStack;
