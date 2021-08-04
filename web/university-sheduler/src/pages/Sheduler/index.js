// import AuthorizationForm from "../components/AuthoriationForm";
import { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SheduleDay from "../../components/ShedulerComponents/SheduleDay";
import { API_URL } from "../../variables";
import "./styles.css";
const listDate = [0, 1, 2, 3, 4, 5, 6];

const ShedulerPage = () => {
  const [name, setName] = useState("");
  const [fio, setFio] = useState([]);
  const dates = listDate.map((dat) => addDays(new Date(), dat));
  useEffect(() => {
    fetch(`${API_URL}/activities/getFio`, {
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=${name}`,
    })
      .then((data) => data.json())
      .then((data) => setFio(data?.surnames))
      .catch(() => {
        alert("Произошла ошибка на сервере ...");
      });
  }, [name]);
  return (
    <div>
      <div className='filters'>
        <Autocomplete
          id='combo-box-demo'
          options={fio}
          getOptionLabel={({ activity, fio }) => (
            <p>
              {fio} <span>{activity}</span>
            </p>
          )}
          style={{ width: 300 }}
          focus={() => {}}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(e) => setName(e.target.value)}
              variant='outlined'
              label='Введите ФИО преподавателя'
              fullWidth
            />
          )}
        />
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
