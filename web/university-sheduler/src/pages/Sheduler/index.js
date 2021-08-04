import { addDays } from "date-fns";

import SheduleDay from "../../components/ShedulerComponents/SheduleDay";
import Filters from "../../components/ShedulerComponents/Filters";
import FilterGroup from "../../components/ShedulerComponents/FiltersGroup";
import FiltersActivity from "../../components/ShedulerComponents/FiltersActivity";
import "./styles.css";
const listDate = [0, 1, 2, 3, 4, 5, 6];

const ShedulerPage = () => {
  const dates = listDate.map((dat) => addDays(new Date(), dat));

  return (
    <div>
      <div className='groupFilters'>
        <Filters />
        <FiltersActivity />
        <FilterGroup />
      </div>
      <div className='sheduler'>
        {dates.map((date) => (
          <SheduleDay date={date} key={date} />
        ))}
      </div>
    </div>
  );
};
export default ShedulerPage;
