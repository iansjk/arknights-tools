import fs from "fs";
import path from "path";

import enItemTable from "./ArknightsGameData/en_US/gamedata/excel/item_table.json";
import cnItemTable from "./ArknightsGameData/zh_CN/gamedata/excel/item_table.json";
import { GameDataItem } from "./gamedata-types";

const enItems: { [itemId: string]: GameDataItem } = enItemTable.items;
const cnItems: { [itemId: string]: GameDataItem } = cnItemTable.items;

export const DATA_OUTPUT_DIRECTORY = path.join(__dirname, "../data");
fs.mkdirSync(DATA_OUTPUT_DIRECTORY, { recursive: true });

const itemNameOverride: { [itemId: string]: string } = {
  mod_unlock_token: "Module Data Block",
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
