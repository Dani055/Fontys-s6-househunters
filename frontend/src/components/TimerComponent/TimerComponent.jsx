import dayjs from "dayjs";
import React, { useEffect, useState } from "react";


function TimerComponent(props) {


    const calculateTimeLeft = () => {
      const now = dayjs();
      let difference;
      let diffDate = dayjs(props.diffDate);
      difference = diffDate.diff(now);

      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
    
      return timeLeft;
    }
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
    
      return () => clearTimeout(timer);
    });
    return (
        <p className="m-0">
            Time remaining:
            <span className="bold">{` ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}</span>
        </p>
    );
}

export default TimerComponent;
