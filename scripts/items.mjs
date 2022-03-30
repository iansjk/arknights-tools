import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import puppeteer from "puppeteer";

import cnBuildingData from "./ArknightsGameData/zh_CN/gamedata/excel/building_data.json" assert { type: "json" };
import cnItemTable from "./ArknightsGameData/zh_CN/gamedata/excel/item_table.json" assert { type: "json" };
import cnStageData from "./ArknightsGameData/zh_CN/gamedata/excel/stage_table.json" assert { type: "json" };
import {
  getEnglishItemName,
  DATA_OUTPUT_DIRECTORY,
  gameDataCostToIngredient,
  convertLMDCostToLMDItem,
} from "./shared.mjs";

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

const fetchLuzarkLPSolverOutput = async () => {
  const LUZARK_LP_SOLVER_URL =
    "https://colab.research.google.com/drive/1lHwJDG7WCAr3KMlxY-HLyD8-yG3boazq";
  const SANITY_VALUE_CELL_ID = "feRucRPwWGZo";
  const STAGE_INFO_CELL_ID = "znmVNbnNWIre";
  const stageRegex =
    /^Activity (?<stageName>[A-Z0-9-]+) \([^)]+\).*Efficiency 100\.000%/;
  const itemRegex = /^(?<itemName>[^:]+): (?<sanityValue>[0-9.]+) sanity value/;
  const cnStageTable = cnStageData.stages;
  const stageNameToKey = Object.fromEntries(
    Object.entries(cnStageTable)
      .filter(([key]) => !key.endsWith("#f#")) // challenge mode stage suffix
      .map(([key, value]) => [value.code, key])
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(LUZARK_LP_SOLVER_URL);
  await Promise.all([
    page.waitForSelector(`#cell-${SANITY_VALUE_CELL_ID}`),
    page.waitForSelector(`#cell-${STAGE_INFO_CELL_ID}`),
  ]);

  const stagesOutputElement = await page.$(
    `#cell-${STAGE_INFO_CELL_ID} .output pre`
  );
  const stagesOutputText = await page.evaluate(
    (el) => el.innerText,
    stagesOutputElement
  );
  /** @type{string[]} */
  const efficientStageNames = stagesOutputText
    .split("\n")
    .map((line) => {
      const result = line.match(stageRegex);
      return result?.groups?.stageName ?? null;
    })
    .filter((item) => item != null)
    .map((stageName) => stageNameToKey[stageName]);

  const sanityValuesOutputElement = await page.$(
    `#cell-${SANITY_VALUE_CELL_ID} .output pre`
  );
  const sanityValuesOutputText = await page.evaluate(
    (el) => el.innerText,
    sanityValuesOutputElement
  );
  /** @type{{[itemName: string]: number}} */
  const itemSanityValues = Object.fromEntries(
    sanityValuesOutputText
      .split("\n")
      .map((line) => {
        const result = line.match(itemRegex);
        if (result && result.groups?.itemName && result.groups?.sanityValue) {
          return [
            result.groups.itemName,
            parseFloat(result.groups.sanityValue),
          ];
        }
        return [];
      })
      .filter((pair) => pair.length > 0)
  );
  await browser.close();

  return { efficientStageNames, itemSanityValues };
};

const createItemsJson = () => {
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

  const itemsJsonPath = path.join(DATA_OUTPUT_DIRECTORY, "items.json");
  fs.writeFileSync(itemsJsonPath, JSON.stringify(itemsJson, null, 2));
  console.log(`items: wrote ${itemsJsonPath}`);

  const itemNameToId = Object.fromEntries(
    Object.entries(itemsJson).map(([id, item]) => [item.name, id])
  );
  const itemNameToIdJsonPath = path.join(
    DATA_OUTPUT_DIRECTORY,
    "item-name-to-id.json"
  );
  fs.writeFileSync(itemNameToIdJsonPath, JSON.stringify(itemNameToId, null, 2));
  console.log(`items: wrote ${itemNameToIdJsonPath}`);
};

export default createItemsJson;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createItemsJson();
}
