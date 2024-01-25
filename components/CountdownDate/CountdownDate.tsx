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

  if (showYears || showMonths || showDays || showHours || showMinutes) {
    return (
      <Box className={css(styles.pill, styles.warning)}>
        &nbsp;
        {showYears ? <span>{timeBetween.years()}yr </span> : null}
        {showMonths ? <span>{timeBetween.months()}m </span> : null}
        {showDays ? <span>{timeBetween.days()}d </span> : null}
        {showHours ? <span>{timeBetween.hours()}h </span> : null}
        {showMinutes ? <span>{timeBetween.minutes()}min </span> : null}
        {/* <span>{timeBetween.seconds()}s</span>  */}
      </Box>
    );
  }

  return (
    <Box className={css(styles.pill, styles.error)}>
      <CircleIcon sx={{ fontSize: "1em" }} />
      &nbsp; Live
    </Box>
  );
};

export default CountdownDate;
