import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";

import { Item, StageData } from "../../../scripts/output-types";
import sanityIcon from "../../images/sanity.png";

import ItemInfoSection from "./ItemInfoSection";

interface Props {
  item: Item;
}

const StageInfo: React.VFC<Props> = (props) => {
  const { item } = props;

  if (
    item.stages == null ||
    (item.stages.mostEfficient == null && item.stages.leastSanity == null)
  ) {
    return null;
  }

  const hasTwoRecommended =
    item.stages.mostEfficient != null && item.stages.leastSanity != null;
  const stages = (
    <>
      {item.stages.mostEfficient && (
        <Stage stage={item.stages.mostEfficient} stageType="Most efficient" />
      )}
      {item.stages.leastSanity && (
        <Stage stage={item.stages.leastSanity} stageType="Least sanity" />
      )}
    </>
  );

  return (
    <ItemInfoSection heading="Recommended stages">
      {hasTwoRecommended ? (
        <Stack spacing={2} direction="row" justifyContent="space-evenly">
          {stages}
        </Stack>
      ) : (
        stages
      )}
    </ItemInfoSection>
  );
};
export default StageInfo;

const Stage: React.VFC<{ stage: StageData; stageType: string }> = (props) => {
  const { stage, stageType } = props;
  const { stageName, dropRate, stageSanityCost, itemSanityCost } = stage;

  return (
    <Box textAlign="center">
      <Typography>{stageType}</Typography>
      <Typography variant="h4" component="span">
        {stageName}
      </Typography>
      <Typography>{Math.round(dropRate * 100)}% chance</Typography>
      <Typography>
        Stage cost: {stageSanityCost}
        <Image src={sanityIcon} alt="Sanity" width={18} height={18} />
      </Typography>
      <Typography>
        Cost per item: {itemSanityCost}
        <Image src={sanityIcon} alt="Sanity" width={18} height={18} />
      </Typography>
    </Box>
  );
};
