import uploadAllImages from "./images.mjs";
import createItemsJson from "./items.mjs";
import createLevelingJson from "./leveling.mjs";
import createOperatorsJson from "./operators.mjs";
import createRecruitmentJson from "./recruitment.mjs";

await Promise.all([
  createItemsJson(),
  createOperatorsJson(),
  createRecruitmentJson(),
  createLevelingJson(),
  uploadAllImages(),
]);
console.log("✅ Done.");
