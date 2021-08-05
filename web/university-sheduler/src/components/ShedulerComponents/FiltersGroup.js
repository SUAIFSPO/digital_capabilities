import { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDispatch } from "react-redux";
import { setGroupFilter } from "../../redux/common/actions";

import { API_URL } from "../../variables";
import "./styles.css";

const FilterGroup = () => {
  const [name, setName] = useState("");
  const [fio, setFio] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    fetch(`${API_URL}/activities/getGroups`, {
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `group=${name}`,
    })
      .then((data) => data.json())
      .then((data) => setFio(data?.groups ?? []))
      .catch(() => {
        console.log("Произошла ошибка на сервере ...");
      });
  }, [name]);

  return (
    <div style={{ marginLeft: "30px" }}>
      <Autocomplete
        id='combo-box-demo'
        options={fio}
        getOptionSelected={(data, a) => dispatch(setGroupFilter(a))}
        getOptionLabel={(group) => group}
        selectOnFocus={true}
        style={{ width: 250 }}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(e) => setName(e.target.value)}
            variant='outlined'
            label='Введите номер группы'
            fullWidth
          />
        )}
      />
    </div>
  );
};
export default FilterGroup;
