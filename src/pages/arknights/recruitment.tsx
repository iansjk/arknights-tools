import {
  Autocomplete,
  TextField,
  Grid,
  Chip,
  SxProps,
  Theme,
  Popper,
} from "@mui/material";
import { Instance } from "@popperjs/core";
import { Combination } from "js-combinatorics";
import { InferGetStaticPropsType } from "next";
import { useEffect, useMemo, useRef, useState } from "react";

import recruitmentJson from "../../../data/recruitment.json";
import Layout from "../../components/Layout";
import RecruitableOperatorChip from "../../components/RecruitableOperatorChip";

export const getStaticProps = () => {
  const TAGS_BY_CATEGORY = {
    Rarity: ["Top Operator", "Senior Operator", "Starter", "Robot"],
    Position: ["Melee", "Ranged"],
    Class: [
      "Caster",
      "Defender",
      "Guard",
      "Medic",
      "Sniper",
      "Specialist",
      "Supporter",
      "Vanguard",
    ],
    Other: [
      "AoE",
      "Crowd-Control",
      "DP-Recovery",
      "DPS",
      "Debuff",
      "Defense",
      "Fast-Redeploy",
      "Healing",
      "Nuker",
      "Shift",
      "Slow",
      "Summon",
      "Support",
      "Survival",
    ],
  };
  const options = Object.entries(TAGS_BY_CATEGORY).flatMap(([type, tagArray]) =>
    tagArray.flatMap((tag) => ({ type, value: tag }))
  );
  return { props: { options } };
};

function getTagCombinations(activeTags: string[]) {
  if (activeTags.length === 0) {
    return [];
  }
  const range = Array(activeTags.length)
    .fill(0)
    .map((_, i) => i + 1);
  return range.flatMap((k) =>
    [...new Combination<string>(activeTags, k)].sort()
  );
}

const Recruitment = ({
  options,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputNode, setInputNode] = useState<HTMLInputElement | null>(null);
  const [resultPaddingTop, setResultPaddingTop] = useState(0);
  const popperRef = useRef<Instance>(null);

  const activeTagCombinations = getTagCombinations(activeTags);
  const matchingOperators = useMemo(
    () =>
      recruitmentJson.filter((result) =>
        activeTagCombinations.find(
          (tags) => tags.toString() === result.tags.toString()
        )
      ),
    [activeTagCombinations]
  );

  useEffect(() => {
    if (inputNode != null) {
      inputNode.focus();
    }
  }, [inputNode]);

  useEffect(() => {
    if (!isOpen) {
      setResultPaddingTop(0);
    }
  }, [isOpen]);

  const handleTagsChanged = (
    _: unknown,
    selectedOptions: {
      type: string;
      value: string;
    }[]
  ) => {
    if (selectedOptions.length <= 5) {
      setActiveTags(selectedOptions.map((option) => option.value).sort());
    }
    if (selectedOptions.length === 5) {
      setIsOpen(false);
    }
  };

  const chipContainerStyles: SxProps<Theme> = {
    display: "flex",
    alignItems: "center",
    gap: (theme) => theme.spacing(1),
    flexWrap: "wrap",
  };

  return (
    <Layout page="/recruitment">
      <Autocomplete
        options={options}
        multiple
        autoHighlight
        openOnFocus
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        groupBy={(option) => option.type}
        getOptionLabel={(option) => option.value}
        disableCloseOnSelect
        renderInput={(params) => (
          <TextField
            {...params}
            label="Available recruitment tags"
            inputRef={setInputNode}
          />
        )}
        onChange={handleTagsChanged}
        PopperComponent={(props) => (
          <Popper
            {...props}
            popperRef={popperRef}
            modifiers={[
              {
                name: "sizeObserver",
                enabled: true,
                phase: "read",
                fn: (data) => {
                  setResultPaddingTop(data.state.rects.popper.height);
                },
              },
            ]}
          />
        )}
      />
      <div style={{ paddingTop: resultPaddingTop }}>
        {matchingOperators
          .sort(
            (
              { tags: tagSetA, operators: opSetA },
              { tags: tagSetB, operators: opSetB }
            ) =>
              Math.min(
                ...opSetB.map((op) => (op.rarity === 1 ? 4 : op.rarity))
              ) -
                Math.min(
                  ...opSetA.map((op) => (op.rarity === 1 ? 4 : op.rarity))
                ) || tagSetB.length - tagSetA.length
          )
          .map(({ tags, operators, guarantees }) => (
            <Grid
              container
              key={tags.join(",")}
              spacing={2}
              sx={{
                my: 2,
                "& ~ &": {
                  pt: 2,
                  borderTop: "1px solid #4d4d4d",
                },
              }}
            >
              <Grid
                item
                xs={12}
                sm={3}
                sx={[
                  chipContainerStyles,
                  {
                    justifyContent: {
                      xs: "center",
                      sm: "flex-end",
                    },
                  },
                ]}
              >
                {guarantees.map((guaranteedRarity) => (
                  <Chip
                    key={`guaranteed${guaranteedRarity}`}
                    label={`${guaranteedRarity}★`}
                    sx={{ background: "#fff", color: "#000" }}
                  />
                ))}
                {tags.map((tag) => (
                  <Chip key={tag} label={tag} />
                ))}
              </Grid>
              <Grid item xs={12} sm={9} sx={chipContainerStyles}>
                {operators.map((operator) => (
                  <RecruitableOperatorChip key={operator.id} {...operator} />
                ))}
              </Grid>
            </Grid>
          ))}
      </div>
    </Layout>
  );
};
export default Recruitment;
