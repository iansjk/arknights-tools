import fs from "fs";
import path from "path";

import gameDataConst from "./ArknightsGameData/zh_CN/gamedata/excel/gamedata_const.json" assert { type: "json" };
import { DATA_OUTPUT_DIRECTORY } from "./shared.mjs";

const {
  maxLevel: maxLevelByRarity,
  characterExpMap: expCostByElite,
  characterUpgradeCostMap: lmdCostByElite,
  evolveGoldCost: eliteLmdCost,
} = gameDataConst;

const out = {
  maxLevelByRarity,
  expCostByElite,
  lmdCostByElite,
  eliteLmdCost,
};
fs.writeFileSync(
  path.join(DATA_OUTPUT_DIRECTORY, "leveling.json"),
  JSON.stringify(out, null, 2)
);
