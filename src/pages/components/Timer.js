import React, { useEffect, useState } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
let interval = 0;
const Timer = ({ deadline, timeUpdator, deadlineSetter, title }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const getTime = () => {
    let currentTime = parseInt(Date.now() / 1000);
    const time = deadline - currentTime;
    // console.log({
    //   title,
    //   currentTime,
    //   deadline,
    //   time,
    // });

    if (time >= 0) {
      timeUpdator(time);
    } else {
      timeUpdator(0);

      deadlineSetter(null);
      clearInterval(interval);

      return 0;
    }
    let days = Math.floor(time / (60 * 60 * 24));
    setDays(days);
    let hours = Math.floor((time / (60 * 60)) % 24);

    setHours(hours);
    let min = Math.floor((time / 60) % 60);
    setMinutes(min);
    let sec = Math.floor(time % 60);
    setSeconds(sec);
  };

  useEffect(() => {
    interval = setInterval(() => getTime(deadline), 1000);
  }, []);

  return (
    <HStack
      key={title + "timer"}
      as={"div"}
      direction={["column", "column", "row"]}
      fontSize={"20px"}
    >
      {days > 0 && (
        <>
          {" "}
          <Text key={"day"} id="day">
            {days}
          </Text>
          <Text key={"dayTitle"} className="text">
            Days
          </Text>
        </>
      )}
      {hours > 0 && (
        <>
          <Text key={"hour"} id="hour">
            {hours}
          </Text>
          <Text key={"hourCaption"} className="text">
            Hours
          </Text>
        </>
      )}
      {minutes > 0 && (
        <>
          <Text key={"min"} id="minute">
            {minutes}
          </Text>
          <Text key={"minCaption"} className="text">
            Minutes
          </Text>
        </>
      )}
      {seconds > 0 && (
        <>
          <Text key={"sec"} id="second">
            {seconds}
          </Text>
          <Text key={"secCaption"} className="text">
            Seconds
          </Text>
        </>
      )}
    </HStack>
  );
};

export default Timer;
