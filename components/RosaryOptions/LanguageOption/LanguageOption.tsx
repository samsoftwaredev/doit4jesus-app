import { useState, ChangeEvent } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { useLanguageContext } from "@/context/LanguageContext";

const languagesList = {
  english: {
    value: "en",
    label: "English",
  },
  spanish: {
    value: "es",
    label: "Español",
  },
  latin: {
    value: "la",
    label: "Latin",
  },
};

const LanguageOption = () => {
  const { setLanguage } = useLanguageContext();
  const [value, setValue] = useState(languagesList.english.value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const values = event.target as HTMLInputElement;
    setValue(values.value);
    setLanguage(values.value);
  };

  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        {Object.values(languagesList).map(({ value, label }) => (
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

export default LanguageOption;
