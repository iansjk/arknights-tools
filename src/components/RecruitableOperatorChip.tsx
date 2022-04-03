import { Tooltip, Chip, Box } from "@mui/material";
import Image from "next/image";
import React from "react";

import { RecruitableOperator } from "../../scripts/output-types";

const RecruitableOperatorChip: React.VFC<RecruitableOperator> = React.memo(
  (props) => {
    const { id, name, rarity, tags } = props;

    return (
      <>
        <Tooltip
          key="chipWrapper"
          arrow
          title={tags.join(", ")}
          describeChild
          placement="bottom"
        >
          <Chip
            className={`rarity-${rarity}`}
            sx={{
              color: "#000000",
              fontSize: (theme) => theme.typography.body1.fontSize,
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
            }}
            avatar={
              <Box ml={1} mr={-2}>
                <Image
                  src={`/arknights/avatars/${id}`}
                  width={24}
                  height={24}
                  className="operator-avatar"
                  alt=""
                />
              </Box>
            }
            label={name}
          />
        </Tooltip>
      </>
    );
  }
);
RecruitableOperatorChip.displayName = "RecruitableOperatorChip";
export default RecruitableOperatorChip;
