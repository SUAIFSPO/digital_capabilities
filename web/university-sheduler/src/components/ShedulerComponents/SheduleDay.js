import { useEffect, useState } from "react";
import { startOfDay, endOfDay } from "date-fns";
import Card from "./Card";
import DateWithDay from "./DateWithDay";

const SheduleDay = ({ date }) => {
  const [activities, setSctivities] = useState([]);
  console.log();
  useEffect(() => {
    fetch(
      `http://192.168.0.42:5000/activities/getSchedule/${(
        startOfDay(date).getTime() / 1000
      ).toFixed(0)}/${(endOfDay(date).getTime() / 1000).toFixed(0)}`,
      { method: "post", headers: {}, body: {} }
    )
      .then((data) => data.json())
      .then((data) => setSctivities(data.schedule));
  }, []);
  return (
    <div>
      <DateWithDay date={date} />
      {activities?.map(({ name, startTime, endTime, listeners, fio, link }) => (
        <Card
          startTime={startTime}
          endTime={endTime}
          fio={fio}
          name={name}
          groups={listeners}
          key={`${fio}_${startTime}`}
          link={link}
        />
      ))}
    </div>
  );
};

export default SheduleDay;
