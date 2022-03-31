import { Stack, Typography } from "@mui/material";

import itemsJson from "../../../data/items.json";
import { Item } from "../../../scripts/output-types";
import ItemStack from "../ItemStack";

import ItemInfoSection from "./ItemInfoSection";

interface Props {
  item: Item;
}

const CraftingInfo: React.VFC<Props> = (props) => {
  const { item } = props;

  if (item.ingredients == null || item.ingredients.length === 0) {
    return null;
  }

  return (
    <ItemInfoSection heading="Crafting recipe">
      <Stack spacing={1} direction="row" justifyContent="space-evenly">
        {item.ingredients.map((ingredient) => {
          const { name: ingredientName } =
            itemsJson[ingredient.id as keyof typeof itemsJson];
          return (
            <Stack spacing={0.5} key={ingredient.id} alignItems="center">
              <ItemStack
                itemId={ingredient.id}
                quantity={ingredient.quantity}
                size={60}
                sx={{
                  color: (theme) => theme.palette.text.primary,
                }}
              />
              <Typography component="span" variant="body2">
                {ingredientName}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </ItemInfoSection>
  );
};
export default CraftingInfo;
