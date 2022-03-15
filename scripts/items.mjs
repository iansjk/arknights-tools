import fs from "fs";
import path from "path";

import cnBuildingData from "./ArknightsGameData/zh_CN/gamedata/excel/building_data.json" assert { type: "json" };
import cnItemTable from "./ArknightsGameData/zh_CN/gamedata/excel/item_table.json" assert { type: "json" };
import {
  getEnglishItemName,
  DATA_OUTPUT_DIRECTORY,
  gameDataCostToIngredient,
  convertLMDCostToLMDItem,
} from "./shared.mjs";

const outputPath = path.join(DATA_OUTPUT_DIRECTORY, "items.json");
const cnItems = cnItemTable.items;
const { workshopFormulas, manufactFormulas: manufactureFormulas } =
  cnBuildingData;

const isPlannerItem = (itemId) => {
  const entry = cnItems[itemId];
  return (
    itemId === "4001" || // LMD
    (entry.classifyType === "MATERIAL" &&
      !itemId.startsWith("p_char_") && // character-specific potential tokens
      !itemId.startsWith("tier") && // generic potential tokens
      !itemId.startsWith("voucher_full_")) // vouchers for event welfare ops like Flamebringer
  );
};

(() => {
  const itemsJson = Object.fromEntries(
    Object.entries(cnItems)
      .filter(([itemId]) => isPlannerItem(itemId))
      .map(([itemId, item]) => {
        const baseOutputItem = {
          id: itemId,
          name: getEnglishItemName(itemId),
          iconId: item.iconId,
          tier: item.rarity + 1,
          sortId: item.sortId,
        };

        const workshopFormulaId = item.buildingProductList.find(
          ({ roomType }) => roomType === "WORKSHOP"
        )?.formulaId;
        const manufactureFormulaId = item.buildingProductList.find(
          ({ roomType }) => roomType === "MANUFACTURE"
        )?.formulaId;
        let formula = null;

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
          const ingredients = formula.costs.map(gameDataCostToIngredient);
          if (formula.goldCost != null && formula.goldCost > 0) {
            ingredients.unshift(convertLMDCostToLMDItem(formula.goldCost));
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
