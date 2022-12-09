import { useState, ChangeEvent } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

const LengthOption = () => {
  const [value, setValue] = useState("18");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const lengthList = [
    {
      value: "18",
      label: "18 min",
    },
    {
      value: "20",
      label: "20 min",
    },
    {
      value: "45",
      label: "45 min",
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
        {lengthList.map(({ value, label }) => (
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

export default LengthOption;
