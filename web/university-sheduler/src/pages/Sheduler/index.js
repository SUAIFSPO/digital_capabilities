import { useEffect, useState } from "react";
import { addDays } from "date-fns";

import SheduleDay from "../../components/ShedulerComponents/SheduleDay";
import Filters from "../../components/ShedulerComponents/Filters";
import FilterGroup from "../../components/ShedulerComponents/FiltersGroup";
import FiltersActivity from "../../components/ShedulerComponents/FiltersActivity";
import "./styles.css";
const listDate = [0, 1, 2, 3, 4, 5, 6];

const ShedulerPage = () => {
  const [c, setC] = useState(new Date());
  const [dates, setDates] = useState(() =>
    listDate.map((dat) => addDays(new Date(), dat))
  );
  useEffect(() => {
    setDates(listDate.map((dat) => addDays(c, dat)));
  }, [c]);

  return (
    <div>
      <div className='groupFilters'>
        <Filters />
        <FiltersActivity />
        <FilterGroup />
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <p
          style={{ fontSize: "34px", cursor: "pointer" }}
          onClick={() => {
            setC((data) => addDays(data, -1));
          }}
        >
          {"<-"}
        </p>

        <div className='sheduler'>
          {dates?.map((date) => (
            <SheduleDay date={date} key={date} />
          ))}
        </div>
        <p
          style={{ fontSize: "34px", cursor: "pointer", whiteSpace: "nowrap" }}
          onClick={() => {
            setC((data) => addDays(data, 1));
          }}
        >
          {"->"}
        </p>
      </div>
    </div>
  );
};
export default ShedulerPage;
