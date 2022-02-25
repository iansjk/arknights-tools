import { Box, makeStyles } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";
import slugify from "../utils";
import { Item } from "../types";
import tier1 from "../data/images/tier1.png";
import tier2 from "../data/images/tier2.png";
import tier3 from "../data/images/tier3.png";
import tier4 from "../data/images/tier4.png";
import tier5 from "../data/images/tier5.png";

function itemBackgroundImage(tier: number) {
  if (tier === 1) {
    return tier1;
  }
  if (tier === 2) {
    return tier2;
  }
  if (tier === 3) {
    return tier3;
  }
  if (tier === 4) {
    return tier4;
  }
  if (tier === 5) {
    return tier5;
  }
  return "";
}

const useStyles = makeStyles({
  itemBackground: {
    position: "relative",
    margin: "auto",
  },
  overlay: {
    display: "flex",
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

interface ItemBaseProps {
  size: number;
  complete?: boolean;
}
type Props = ItemBaseProps & Item;

const ItemBase = React.memo(function ItemBase({
  name,
  tier,
  size,
  complete = false,
}: Props): React.ReactElement {
  const classes = useStyles();
  const backgroundSize = Math.floor(size * (95 / 100));
  const itemBackgroundStyle = {
    backgroundImage:
      backgroundSize < 40 ? "" : `url(${itemBackgroundImage(tier)})`,
    opacity: complete ? 0.3 : 1,
    width: backgroundSize,
    height: backgroundSize,
    backgroundSize: `${backgroundSize}px ${backgroundSize}px`,
  };

  return (
    <Box position="relative">
      <div className={classes.itemBackground} style={itemBackgroundStyle}>
        <img
          src={`https://res.cloudinary.com/samidare/image/upload/c_pad,h_${size},w_${size}/e_sharpen/f_auto,q_auto/v1/arknights/items/${slugify(
            name
          )}`}
          alt={name}
          width={size}
          height={size}
        />
      </div>
      {complete && (
        <Box data-cy="complete" className={classes.overlay} top="0" zIndex="1">
          <CheckCircleIcon htmlColor="greenyellow" fontSize="large" />
        </Box>
      )}
    </Box>
  );
});
export default ItemBase;
