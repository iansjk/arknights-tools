import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import enItemTable from "./ArknightsGameData/en_US/gamedata/excel/item_table.json" assert { type: "json" };
import cnCharacterTable from "./ArknightsGameData/zh_CN/gamedata/excel/character_table.json" assert { type: "json" };
import cnItemTable from "./ArknightsGameData/zh_CN/gamedata/excel/item_table.json" assert { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const enItems = enItemTable.items;
const cnItems = cnItemTable.items;

export const DATA_OUTPUT_DIRECTORY = path.join(__dirname, "../data");
fs.mkdirSync(DATA_OUTPUT_DIRECTORY, { recursive: true });

const unofficialItemNameTranslations = {
  mod_update_token_1: "Supplementary Data Bar",
  mod_update_token_2: "Supplementary Data Instrument",
};

export const getEnglishItemName = (itemId) => {
  const enEntry = enItems[itemId];
  const cnName = cnItems[itemId].name;
  let name = enEntry?.name;
  if (name == null) {
    const unofficialName = unofficialItemNameTranslations[itemId];
    if (unofficialName != null) {
      console.log(
        `Using unofficial item name translation for ID '${itemId}' => '${unofficialName}'`
      );
      name = unofficialName;
    } else if (cnName != null) {
      console.warn(`No item name translation found for ID '${itemId}'`);
      name = cnName;
    } else {
      throw new Error(`Couldn't find item name for ID '${itemId}'`);
    }
  }
  return name;
};

const operatorNameOverride = {
  ShiraYuki: "Shirayuki",
  Гум: "Gummy",
  Зима: "Zima",
  Истина: "Istina",
  Роса: "Rosa",
  Позёмка: "Pozyomka",
};

export const getOperatorName = (operatorId) => {
  if (operatorId === "char_1001_amiya2") {
    return "Amiya (Guard)";
  }
  const entry = cnCharacterTable[operatorId];
  if (entry == null) {
    throw new Error(`No such operator: "${operatorId}"`);
  } else if (entry.isNotObtainable) {
    console.warn(`Operator is not obtainable: "${operatorId}"`);
  }
  const { appellation } = entry;
  return operatorNameOverride[appellation] ?? appellation;
};

export const gameDataCostToIngredient = (cost) => {
  const { id, count } = cost;
  return {
    id,
    quantity: count,
  };
};

export const convertLMDCostToLMDItem = (cost) => ({
  id: "4001",
  quantity: cost,
});

export const getEliteLMDCost = (rarity, eliteLevel) => {
  let quantity = -1;
  if (rarity === 3) {
    quantity = 10000;
  } else if (rarity === 4) {
    quantity = eliteLevel === 2 ? 60000 : 15000;
  } else if (rarity === 5) {
    quantity = eliteLevel === 2 ? 120000 : 20000;
  } else if (rarity === 6) {
    quantity = eliteLevel === 2 ? 180000 : 30000;
  }
  return convertLMDCostToLMDItem(quantity);
};

export function toTitleCase(string) {
  return [...string.toLowerCase()]
    .map((char, i) => (i === 0 ? char.toUpperCase() : char))
    .join("");
}

export function professionToClass(profession) {
  switch (profession) {
    case "PIONEER":
      return "Vanguard";
    case "WARRIOR":
      return "Guard";
    case "SPECIAL":
      return "Specialist";
    case "TANK":
      return "Defender";
    case "SUPPORT":
      return "Supporter";
    default:
      return toTitleCase(profession);
  }
}
