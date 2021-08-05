import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { startOfDay, endOfDay } from "date-fns";
import Card from "./Card";
import DateWithDay from "./DateWithDay";
import { API_URL } from "../../variables";

const SheduleDay = ({ date }) => {
  const [activities, setSctivities] = useState([]);
  const teacherFilter = useSelector(
    ({ commonReducer }) => commonReducer?.teacher?.fio
  );
  const groupFilter = useSelector(
    ({ commonReducer }) => commonReducer?.groupFilter
  );
  const activityFilter = useSelector(
    ({ commonReducer }) => commonReducer?.activityFilter
  );
  useEffect(() => {
    fetch(
      `${API_URL}/activities/getSchedule/${(
        startOfDay(date).getTime() / 1000
      ).toFixed(0)}/${(endOfDay(date).getTime() / 1000).toFixed(0)}`,
      {
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `fio=${teacherFilter ?? ""}&group=${groupFilter ?? ""}&name=${
          activityFilter ?? ""
        }`,
      }
    )
      .then((data) => data.json())
      .then((data) => setSctivities(data.schedule));
  }, [teacherFilter, groupFilter, activityFilter]);
  return (
    <div>
      <DateWithDay date={date} />
      {activities?.map(
        ({ name, startTime, endTime, listeners, fio, link }, i) => (
          <Card
            startTime={startTime}
            endTime={endTime}
            fio={fio}
            name={name}
            groups={listeners}
            key={`${date}_${i}`}
            link={link}
          />
        )
      )}
    </div>
  );
};

export default SheduleDay;
