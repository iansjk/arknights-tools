import fs from "fs";
import path from "path";

import cnBuildingData from "./ArknightsGameData/zh_CN/gamedata/excel/building_data.json";
import cnItemTable from "./ArknightsGameData/zh_CN/gamedata/excel/item_table.json";
import { GameDataItem } from "./gamedata-types";
import { Ingredient, OutputItem } from "./output-types";
import { getEnglishItemName, DATA_OUTPUT_DIRECTORY } from "./shared";

const outputPath = path.join(DATA_OUTPUT_DIRECTORY, "items.json");
const cnItems: { [itemId: string]: GameDataItem } = cnItemTable.items;
const {
  workshopFormulas,
  manufactFormulas: manufactureFormulas,
}: {
  workshopFormulas: { [formulaId: string]: GameDataFormula };
  manufactFormulas: { [formulaId: string]: GameDataFormula };
} = cnBuildingData;

interface GameDataFormulaCost {
  id: string;
  count: number;
}

interface GameDataFormula {
  goldCost?: number;
  count: number;
  costs: GameDataFormulaCost[];
  formulaType: string;
}

const isPlannerItem = (itemId: string) => {
  const entry = cnItems[itemId];
  return (
    entry.classifyType === "MATERIAL" &&
    !itemId.startsWith("p_char_") && // character-specific potential tokens
    !itemId.startsWith("tier") && // generic potential tokens
    !itemId.startsWith("voucher_full_") // vouchers for event welfare ops like Flamebringer
  );
};

const convertFormulaCostToIngredient = (
  cost: GameDataFormulaCost
): Ingredient => {
  const { id, count } = cost;
  const ingredientEntry = cnItems[id];

  return {
    id,
    name: getEnglishItemName(id),
    tier: ingredientEntry.rarity + 1,
    sortId: ingredientEntry.sortId,
    quantity: count,
  };
};

(() => {
  const itemsJson: { [itemId: string]: OutputItem } = Object.fromEntries(
    Object.entries(cnItems)
      .filter(([itemId]) => isPlannerItem(itemId))
      .map(([itemId, item]) => {
        const baseOutputItem = {
          id: itemId,
          name: getEnglishItemName(itemId),
          tier: item.rarity + 1,
          sortId: item.sortId,
        };

        const workshopFormulaId = item.buildingProductList.find(
          ({ roomType }) => roomType === "WORKSHOP"
        )?.formulaId;
        const manufactureFormulaId = item.buildingProductList.find(
          ({ roomType }) => roomType === "MANUFACTURE"
        )?.formulaId;
        let formula: GameDataFormula | null = null;

        if (workshopFormulaId) {
          formula = workshopFormulas[workshopFormulaId];
        } else if (
          // a bit hacky, but we don't want to include yield: 1; ingredients: [] for EXP items
          manufactureFormulaId &&
          !manufactureFormulas[manufactureFormulaId].formulaType.endsWith("EXP")
        ) {
          formula = manufactureFormulas[manufactureFormulaId];
        }
        if (formula) {
          const ingredients = formula.costs.map(convertFormulaCostToIngredient);
          if (formula.goldCost != null && formula.goldCost > 0) {
            ingredients.unshift({
              id: "4001",
              name: "LMD",
              tier: 4,
              quantity: formula.goldCost,
              sortId: 10004,
            });
          }
          return [
            itemId,
            { ...baseOutputItem, ingredients, yield: formula.count },
          ];
        }
        return [itemId, baseOutputItem];
      })
  );

  fs.writeFileSync(outputPath, JSON.stringify(itemsJson, null, 2));
})();
