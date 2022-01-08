import fs from "fs";
import path from "path";

import cnBuildingData from "./ArknightsGameData/zh_CN/gamedata/excel/building_data.json";
import cnItemTable from "./ArknightsGameData/zh_CN/gamedata/excel/item_table.json";
import { GameDataCost, GameDataItem } from "./gamedata-types";
import { OutputItem } from "./output-types";
import {
  getEnglishItemName,
  DATA_OUTPUT_DIRECTORY,
  gameDataCostToIngredient,
  convertLMDCostToLMDItem,
} from "./shared";

const outputPath = path.join(DATA_OUTPUT_DIRECTORY, "items.json");
const cnItems: { [itemId: string]: GameDataItem } = cnItemTable.items;
const {
  workshopFormulas,
  manufactFormulas: manufactureFormulas,
}: {
  workshopFormulas: { [formulaId: string]: GameDataFormula };
  manufactFormulas: { [formulaId: string]: GameDataFormula };
} = cnBuildingData;

interface GameDataFormula {
  goldCost?: number;
  count: number;
  costs: GameDataCost[];
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
