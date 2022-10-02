import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import gameDataConst from "./GameData/zh_CN/gamedata/excel/gamedata_const.json" assert { type: "json" };
import { DATA_OUTPUT_DIRECTORY } from "./shared.mjs";

const {
  maxLevel: maxLevelByRarity,
  characterExpMap: expCostByElite,
  characterUpgradeCostMap: lmdCostByElite,
  evolveGoldCost: eliteLmdCost,
} = gameDataConst;

const createLevelingJson = () => {
  const out = {
    maxLevelByRarity,
    expCostByElite,
    lmdCostByElite,
    eliteLmdCost,
  };
  const outPath = path.join(DATA_OUTPUT_DIRECTORY, "leveling.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`leveling: wrote ${outPath}`);
};

export default createLevelingJson;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createLevelingJson();
}
