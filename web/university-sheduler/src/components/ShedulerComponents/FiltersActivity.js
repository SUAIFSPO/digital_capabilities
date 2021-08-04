import { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDispatch } from "react-redux";
import { setActivityFilter } from "../../redux/common/actions";

import { API_URL } from "../../variables";
import "./styles.css";

const FiltersActivity = () => {
  const [name, setName] = useState("");
  const [fio, setFio] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    fetch(`${API_URL}/activities/getNames`, {
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=""`,
    })
      .then((data) => data.json())
      .then((data) => setFio(data?.names ?? []))
      .catch(() => {
        console.log("Произошла ошибка на сервере ...");
      });
  }, []);
  useEffect(() => {
    fetch(`${API_URL}/activities/getNames`, {
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=${name}`,
    })
      .then((data) => data.json())
      .then((data) => setFio(data?.names ?? []))
      .catch(() => {
        console.log("Произошла ошибка на сервере ...");
      });
  }, [name]);

  return (
    <div>
      <Autocomplete
        id='combo-box-demo'
        options={fio}
        getOptionSelected={(data) => dispatch(setActivityFilter(data))}
        getOptionLabel={(name) => name}
        selectOnFocus={true}
        onSelect={(data) => setName(data.target.value)}
        style={{ width: 400 }}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(e) => setName(e.target.value)}
            variant='outlined'
            label='Введите  название предмета'
            fullWidth
          />
        )}
      />
    </div>
  );
};
export default FiltersActivity;
