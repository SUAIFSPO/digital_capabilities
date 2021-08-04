import { format } from "date-fns";
const DateWithDay = ({ date }) => {
  return (
    <div>
      <p>{format(date, "dd.MM.yyyy")}</p>
      <p>{format(date, "EEEE")}</p>
    </div>
  );
};
export default DateWithDay;
