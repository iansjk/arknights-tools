import React from "react";
import { Box } from "@material-ui/core";
import { getOperatorImagePublicId } from "../utils";
import noOperatorImage from "../data/images/no-operator.png";

const DEFAULT_SIZE = 100;

export interface OperatorImageProps {
  name?: string;
  size?: number;
  elite?: 0 | 1 | 2;
  hideBorder?: boolean;
}

function OperatorImage({
  name,
  size = DEFAULT_SIZE,
  elite,
  hideBorder = false,
}: OperatorImageProps): React.ReactElement {
  const eliteAltText = elite != null ? `Elite ${elite}` : "";
  const eliteIconSize = Math.max(Math.floor(size / 3), 35);
  const operatorImageSrc =
    name != null
      ? `https://res.cloudinary.com/samidare/image/upload/f_auto,q_auto/${getOperatorImagePublicId(
          name,
          elite
        )}`
      : noOperatorImage;
  return (
    <Box
      position="relative"
      width={size}
      height={size}
      border={!hideBorder && "1px solid #c0c0c0"}
      boxSizing="border-box"
    >
      <img
        width={hideBorder ? size : size - 2}
        height={hideBorder ? size : size - 2}
        src={operatorImageSrc}
        alt={name != null ? `${name}${eliteAltText}` : "No operator"}
      />
      {name != null && elite != null && (
        <Box clone position="absolute" right={0} bottom={0}>
          <img
            src={`https://res.cloudinary.com/samidare/image/upload/e_outline:1,f_auto,q_auto,w_${eliteIconSize},h_${eliteIconSize}/v1/arknights/elite/${elite}`}
            alt=""
            width={eliteIconSize}
            height={eliteIconSize}
          />
        </Box>
      )}
    </Box>
  );
}
export default OperatorImage;
