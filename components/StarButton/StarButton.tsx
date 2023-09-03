import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { IconButton } from "@mui/material";
import { useState } from "react";

interface Props {
  onClick: (value: boolean) => void;
  value?: boolean;
}

const StarButton = ({ onClick, value = false }: Props) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handelClick = () => {
    onClick(!isClicked);
    setIsClicked((oldValue) => !oldValue);
  };

  return (
    <IconButton onClick={handelClick}>
      {!isClicked ? (
        <StarBorderIcon color="warning" />
      ) : (
        <StarIcon color="warning" />
      )}
    </IconButton>
  );
};

export default StarButton;
