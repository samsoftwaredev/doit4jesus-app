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
  let interval: undefined | any = undefined;
  const [currentTime, setCurrentTime] = useState(moment());
  const timeRemaining = moment.duration(moment(targetTime).diff(currentTime));
  const eventDuration = currentTime.add(2, "hour");
  const eventIsOld = moment.duration(moment(targetTime).diff(eventDuration));

  const stopTimer = () => {
    if (interval) clearInterval(interval);
  };

  useEffect(() => {
    interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => stopTimer();
  }, []);

  const showYears = timeRemaining.years() > 0;
  const showMonths = timeRemaining.months() > 0;
  const showDays = timeRemaining.days() > 0;
  const showHours = timeRemaining.hours() > 0;
  const showMinutes = timeRemaining.minutes() > 0;
  const showSeconds =
    timeRemaining.seconds() > 0 && timeRemaining.minutes() <= 1;
  const isNotLive = eventIsOld.hours() < 0;
  const showSecondsCount =
    timeRemaining.hours() === 0 && timeRemaining.minutes() <= 5 && showSeconds;

  const countdownIsNotZero =
    showYears ||
    showMonths ||
    showDays ||
    showHours ||
    showMinutes ||
    showSeconds;

  if (countdownIsNotZero) {
    return (
      <Box className={css(styles.pill, styles.warning)}>
        Starts in&nbsp;
        {showYears ? <span>{timeRemaining.years()}yr&nbsp;</span> : null}
        {showMonths ? <span>{timeRemaining.months()}m&nbsp;</span> : null}
        {showDays ? <span>{timeRemaining.days()}d&nbsp;</span> : null}
        {showHours ? <span>{timeRemaining.hours()}h&nbsp;</span> : null}
        {showMinutes ? <span>{timeRemaining.minutes()}min&nbsp;</span> : null}
        {showSecondsCount ? (
          <span>{timeRemaining.seconds()}s&nbsp;</span>
        ) : null}
      </Box>
    );
  }

  if (isNotLive) {
    stopTimer();
    return null;
  }

  stopTimer();
  return (
    <Box className={css(styles.pill, styles.error)}>
      <CircleIcon sx={{ fontSize: "1em" }} />
      &nbsp;Live
    </Box>
  );
};

export default CountdownDate;
