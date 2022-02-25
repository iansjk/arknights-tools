import { Chip, Avatar, makeStyles, Tooltip } from "@material-ui/core";
import React from "react";
import { getOperatorImagePublicId } from "../utils";

export interface RecruitableOperator {
  name: string;
  rarity: number;
  tags: string[];
}

const useChipStyles = makeStyles((theme) => ({
  root: {
    color: "#000000",
    "&.rarity-6": {
      backgroundColor: "#f96601",
    },
    "&.rarity-5": {
      backgroundColor: "#fbae02",
    },
    "&.rarity-4": {
      backgroundColor: "#dbb1db",
    },
    "&.rarity-3": {
      backgroundColor: "#00b2f6",
    },
    "&.rarity-2": {
      backgroundColor: "#dce537",
    },
    "&.rarity-1": {
      backgroundColor: "#9f9f9f",
    },
  },
  label: {
    fontSize: theme.typography.body1.fontSize,
  },
}));

const RecruitableOperatorChip = React.memo(function RecruitableOperatorChip({
  name,
  rarity,
  tags,
}: RecruitableOperator): React.ReactElement {
  const chipClasses = useChipStyles();

  return (
    <>
      <Tooltip
        title={tags.join(", ")}
        arrow
        placement="bottom"
        enterTouchDelay={1}
        key="chipWrapper"
      >
        <Chip
          className={`rarity-${rarity}`}
          classes={{
            root: chipClasses.root,
            label: chipClasses.label,
          }}
          avatar={
            <Avatar
              alt=""
              src={`https://res.cloudinary.com/samidare/image/upload/c_pad,h_24,w_24/f_auto,q_auto/v1/${getOperatorImagePublicId(
                name
              )}`}
            />
          }
          label={name}
        />
      </Tooltip>
    </>
  );
});
export default RecruitableOperatorChip;
