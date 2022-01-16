import fs from "fs";
import path from "path";

import enItemTable from "./ArknightsGameData/en_US/gamedata/excel/item_table.json";
import cnCharacterTable from "./ArknightsGameData/zh_CN/gamedata/excel/character_table.json";
import cnItemTable from "./ArknightsGameData/zh_CN/gamedata/excel/item_table.json";
import * as GameData from "./gamedata-types";
import { Ingredient } from "./output-types";

const enItems: { [itemId: string]: GameData.Item } = enItemTable.items;
const cnItems: { [itemId: string]: GameData.Item } = cnItemTable.items;
const cnCharacters = cnCharacterTable as {
  [charId: string]: GameData.Character;
};

export const DATA_OUTPUT_DIRECTORY = path.join(__dirname, "../data");
fs.mkdirSync(DATA_OUTPUT_DIRECTORY, { recursive: true });

const itemNameOverride: { [itemId: string]: string } = {
  31043: "Compound Cutting Fluid",
  31044: "Cutting Stock Solution",
  31053: "Semi-natural Solvent",
  31054: "Refined Solvent",
};

export const getEnglishItemName = (itemId: string) => {
  const enEntry = enItems[itemId];
  const cnName = cnItems[itemId].name;
  let name = itemNameOverride[itemId] ?? enEntry.name;
  if (name == null) {
    if (cnName != null) {
      console.warn(`No item name translation found for ID '${itemId}'`);
      name = cnName;
    } else {
      throw new Error(`Couldn't find item name for ID '${itemId}'`);
    }
  }
  return name;
};

const operatorNameOverride: { [operatorId: string]: string } = {
  ShiraYuki: "Shirayuki",
  Гум: "Gummy",
  Зима: "Zima",
  Истина: "Istina",
  Роса: "Rosa",
};

export const getOperatorName = (operatorId: string) => {
  if (operatorId === "char_1001_amiya2") {
    return "Amiya (Guard)";
  }
  const entry = cnCharacters[operatorId];
  if (entry == null) {
    throw new Error(`No such operator: "${operatorId}"`);
  } else if (entry.isNotObtainable) {
    console.warn(`Operator is not obtainable: "${operatorId}"`);
  }
  const { appellation } = entry;
  return operatorNameOverride[appellation] ?? appellation;
};

export const gameDataCostToIngredient = (cost: GameData.Cost): Ingredient => {
  const { id, count } = cost;
  return {
    id,
    quantity: count,
  };
};

export const convertLMDCostToLMDItem = (cost: number): Ingredient => ({
  id: "4001",
  quantity: cost,
});

export const getEliteLMDCost = (
  rarity: number,
  eliteLevel: number
): Ingredient => {
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

export function toTitleCase(string: string): string {
  return [...string.toLowerCase()]
    .map((char, i) => (i === 0 ? char.toUpperCase() : char))
    .join("");
}

export function professionToClass(profession: string): string {
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
