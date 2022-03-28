import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";

import operatorsJson from "../../data/operators.json";
import { Operator } from "../../scripts/output-types";

interface Props {
  value: Operator | null;
  onChange: (value: Operator | null) => void;
}

const OperatorSearch: React.VFC<Props> = (props) => {
  const { value, onChange } = props;
  const operators = useMemo(
    () =>
      Object.values(operatorsJson)
        .filter((op) => op.rarity >= 3)
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  return (
    <Autocomplete
      autoComplete
      autoHighlight
      value={value}
      onChange={(_: unknown, newValue: Operator | null) => onChange(newValue)}
      options={operators}
      getOptionLabel={(op) => op.name}
      renderInput={(params) => {
        const { InputProps, ...otherParams } = params;
        const { startAdornment: _, ...otherInputProps } = InputProps;
        return (
          <TextField
            {...otherParams}
            label="Choose an operator"
            sx={{
              "& .MuiInputBase-input": {
                pl: 0,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ pl: 1 }}>
                  {value != null ? (
                    <Image
                      src={`/images/avatars/${value.id}.png`}
                      width={32}
                      height={32}
                      alt=""
                      className="operator-avatar"
                    />
                  ) : (
                    <AccountCircleIcon width={32} height={32} />
                  )}
                </InputAdornment>
              ),
              ...otherInputProps,
            }}
          />
        );
      }}
      renderOption={(props, option) => (
        <li {...props}>
          <Box mr={2} display="inline-flex" alignItems="center">
            <Image
              src={`/images/avatars/${option.id}.png`}
              width={32}
              height={32}
              alt=""
              className="operator-avatar"
            />
          </Box>
          {option.name}
        </li>
      )}
      filterOptions={(options, state) => {
        return options.filter((op) =>
          op.name
            .toLowerCase()
            .replace(/['"]/g, "")
            .startsWith(state.inputValue)
        );
      }}
      sx={{
        flexGrow: 1,
        mr: 2,
      }}
    />
  );
};
export default OperatorSearch;
