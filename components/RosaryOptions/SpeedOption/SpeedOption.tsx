import { useState, ChangeEvent } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

const SpeedOption = () => {
  const [value, setValue] = useState("1.0");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const speedList = [
    {
      value: "0.75",
      label: "0.75x",
    },
    {
      value: "1.0",
      label: "1.0x",
    },
    {
      value: "1.25",
      label: "1.25x",
    },
    {
      value: "1.50",
      label: "1.50x",
    },
    {
      value: "1.75",
      label: "1.75x",
    },
    {
      value: "2.0",
      label: "2.0x",
    },
  ];

  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        {speedList.map(({ value, label }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default SpeedOption;
