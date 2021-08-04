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
    fetch(`${API_URL}/activities/getFio`, {
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=${name}`,
    })
      .then((data) => data.json())
      .then((data) => setFio(data?.surnames ?? []))
      .catch(() => {
        console.log("Произошла ошибка на сервере ...");
      });
  }, [name]);

  return (
    <div>
      <Autocomplete
        id='combo-box-demo'
        options={fio}
        getOptionSelected={(data) => dispatch(setGroupFilter(data))}
        getOptionLabel={({ group }) => group}
        selectOnFocus={true}
        onSelect={(data) => setName(data.target.value)}
        style={{ width: 215 }}
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
