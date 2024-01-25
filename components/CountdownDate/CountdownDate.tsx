import { Box } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import styles from "./countdownDate.module.scss";
import { css } from "@/utils/helpers";
import CircleIcon from "@mui/icons-material/Circle";

interface Props {
  targetTime?: Date;
}

const CountdownDate = ({ targetTime = new Date() }: Props) => {
  const [currentTime, setCurrentTime] = useState(moment());
  const timeBetween = moment.duration(moment(targetTime).diff(currentTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const showYears = timeBetween.years() > 0;
  const showMonths = timeBetween.months() > 0;
  const showDays = timeBetween.days() > 0;
  const showHours = timeBetween.hours() > 0;
  const showMinutes = timeBetween.minutes() > 0;
  const showSeconds = timeBetween.seconds() > 0 && timeBetween.minutes() <= 1;

  const countdownIsZero =
    showYears ||
    showMonths ||
    showDays ||
    showHours ||
    showMinutes ||
    showSeconds;

  if (countdownIsZero) {
    return (
      <Box className={css(styles.pill, styles.warning)}>
        Starts in&nbsp;
        {showYears ? <span>{timeBetween.years()}yr&nbsp;</span> : null}
        {showMonths ? <span>{timeBetween.months()}m&nbsp;</span> : null}
        {showDays ? <span>{timeBetween.days()}d&nbsp;</span> : null}
        {showHours ? <span>{timeBetween.hours()}h&nbsp;</span> : null}
        {showMinutes ? <span>{timeBetween.minutes()}min&nbsp;</span> : null}
        {showSeconds ? <span>{timeBetween.seconds()}s&nbsp;</span> : null}
      </Box>
    );
  }

  return (
    <Box className={css(styles.pill, styles.error)}>
      <CircleIcon sx={{ fontSize: "1em" }} />
      &nbsp;Live
    </Box>
  );
};

export default CountdownDate;
