import { TextField, TextFieldProps } from "@mui/material";
import { useState, useRef, useCallback, useEffect } from "react";

interface Props {
  validator: (newValue: string) => boolean;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  revalidateOn?: unknown[];
}

const ValidatedTextField: React.FC<Props & TextFieldProps> = (props) => {
  const {
    validator,
    onChange,
    revalidateOn = [],
    value: _value,
    error: _error,
    ...rest
  } = props;
  const [isValid, setIsValid] = useState(true);
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const valid = validator(e.target.value);
      setIsValid(valid);
      if (valid) {
        onChange(e);
      }
    },
    [onChange, validator]
  );

  useEffect(() => {
    if (ref.current) {
      setIsValid(validator(ref.current.value));
    }
  }, [revalidateOn, validator]);

  return (
    <TextField
      inputRef={ref}
      onChange={handleChange}
      error={!isValid}
      {...rest}
    />
  );
};
export default ValidatedTextField;
