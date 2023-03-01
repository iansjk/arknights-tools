import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as lz from "../lz-string";
import { selectStock } from "../store/depotSlice";

import {
  selectGoals,
} from "../store/goalsSlice";
import { useAppSelector } from "../store/hooks";

const MigrationModal: React.FC = () => {
  const goals = useAppSelector(selectGoals);
  const stock = useAppSelector(selectStock);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (router.query.migrate) {
      redirect();
    }
  }, [router])

  const redirect = () => {
    const value = lz.compressToBase64(JSON.stringify({ goals, stock }));
    navigator.clipboard.writeText(`kr-${value}`);
    window.location.href = "https://www.krooster.com/planner/goals?d=1";
  }

  return (<>
    <Button onClick={() => setOpen(v => !v)}
      sx={{
        display: "block",
        color: "inherit",
        textDecoration: "none",
        width: "100%",
        height: "100%",
        "&:hover > em": {
          color: "#ffd440",
        },
        "& > em": {
          fontStyle: "normal",
          transition: "color 0.25s"
        }
      }}
    >
      Migrate to <em>Krooster</em>
    </Button>
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        Migration Helper
      </DialogTitle>
      <DialogContent sx={{ "& > p": { my: 1 } }}>
        <p>
          As of March 1, 2023, Arknights Tools is <b>no longer being supported</b>.
          The page will remain available and functional, but updates may slow down
          or stop entirely. <b>Click the button</b> to transfer your data to Krooster, which
          has inherited these tools.
        </p>
        <p>If prompted, allow access to copy text to the clipboard, or else the data transfer will fail.</p>
        <Button onClick={redirect}
          sx={{
            display: "block",
            color: "inherit",
            textDecoration: "none",
            width: "100%",
            height: "100%",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            py: 2,
            "&:hover > em": {
              color: "#ffd440",
            },
            "& > em": {
              fontStyle: "normal",
              transition: "color 0.25s"
            }
          }}
        >
          Migrate (and open <em>Krooster</em>)
        </Button>
      </DialogContent>
    </Dialog>
  </>
  );
};
export default MigrationModal;
