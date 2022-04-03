import { Tooltip, Chip } from "@mui/material";
import Image from "next/image";
import React from "react";

import { RecruitableOperator } from "../../scripts/output-types";

const RecruitableOperatorChip: React.VFC<RecruitableOperator> = React.memo(
  (props) => {
    const { name, rarity, tags } = props;

    return (
      <>
        <Tooltip
          title={tags.join(", ")}
          arrow
          placement="bottom"
          key="chipWrapper"
          sx={{}}
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
            // avatar={}
            label={name}
          />
        </Tooltip>
      </>
    );
  }
);
RecruitableOperatorChip.displayName = "RecruitableOperatorChip";
export default RecruitableOperatorChip;
