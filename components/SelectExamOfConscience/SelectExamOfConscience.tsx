import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Link,
  Typography,
} from "@mui/material";
import adultExamOfConscience from "@/data/adultExamOfConscience.json";
import teenExamOfConscience from "@/data/teenExamOfConscience.json";
import childExamOfConscience from "@/data/childExamOfConscience.json";
import styles from "./SelectExamOfConscience.module.scss";

interface Props {
  onExamSelected: (exam: string) => void;
}

const SelectExamOfConscience = ({ onExamSelected }: Props) => {
  const exams = {
    child: {
      label: "For Kids",
      value: childExamOfConscience,
      image:
        "https://i.pinimg.com/564x/95/78/3b/95783b0c78b1047f4f3d06ff57fe380c.jpg",
      description:
        "This can assist children in developing a better understanding of themselves, their moral value, attitudes toward others and their relationship with God.",
    },
    teen: {
      label: "For Teens",
      value: teenExamOfConscience,
      image:
        "https://i.pinimg.com/564x/dd/33/2a/dd332a074e423da0794fb52258e97f81.jpg",
      description:
        "This examination enables teens to recognize and manage their emotions, actions, and attitudes as well as their personal relationship with the spiritual.",
    },
    adult: {
      label: "For Adults",
      value: adultExamOfConscience,
      image:
        "https://www.catholicartandjewelry.com/cdn/shop/products/5a3bda6d-8367-587b-9fa5-c656ccd5f105.jpg?v=1667270034&width=1426",
      description:
        "This exam encourages adults to question and analyze their thoughts and daily actions. This process promotes critical thinking skills, helping them approach situations with thoughtfulness, an analytical mindset, and faith.",
    },
  };

  const examTypes = Object.values(exams).map(
    (examOfConscience) => examOfConscience
  );

  return (
    <>
      <Typography my={2} color="white" variant="h5">
        Select type of conscience examination:
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        mx={2}
        className={styles.cardContainer}
      >
        {examTypes.map(({ label, description, image }) => (
          <Card
            sx={{ textDecoration: "none" }}
            component={Link}
            onClick={() => onExamSelected(label)}
            className={styles.card}
          >
            <CardMedia
              className={styles.cardImage}
              component="img"
              image={image}
              alt={label}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography
                  component="div"
                  variant="h5"
                  className={styles.title}
                >
                  {label}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="p"
                  className={styles.description}
                >
                  {description}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default SelectExamOfConscience;
