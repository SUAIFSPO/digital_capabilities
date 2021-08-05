import React, { useState, useEffect } from "react";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { API_URL } from "../variables";

const RecoveryPass = ({ open, setOpen }) => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [newGroup, setNewGroups] = useState([]);
  const [isPrepod, setIsPrepod] = useState(false);
  const [users, setUsers] = useState([]);
  const [act, setAct] = useState([]);
  const [actName, setActName] = useState("");
  const [lastActname, setLastActName] = useState("");
  useEffect(() => {
    fetch(`${API_URL}/users/getAll`)
      .then((data) => data.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);
  const handleClose = () => {};
  useEffect(() => {
    fetch(`${API_URL}/activities/getGroups`, {
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `group=${groups}`,
    })
      .then((data) => data.json())
      .then((data) => setGroups(data?.groups ?? []))
      .catch(() => {
        console.log("Произошла ошибка на сервере ...");
      });
  }, [name]);
  useEffect(() => {
    fetch(`${API_URL}/activities/getNames`, {
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=${actName}`,
    })
      .then((data) => data.json())
      .then((data) => setAct(data?.names ?? []))
      .catch(() => {
        console.log("Произошла ошибка на сервере ...");
      });
  }, [actName]);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
        maxWidth='lg'
      >
        <DialogTitle id='form-dialog-title'>Назначение групп</DialogTitle>
        <DialogContent>
          {users?.map(({ login, name, type, groups: defaultGroup }) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              {`Логин = ${login}, ФИО = ${name}`}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                Преподаватель
                <br />
                <Checkbox
                  defaultChecked={type === "curator"}
                  onChange={(e) => {
                    setIsPrepod(e.target.checked);
                  }}
                />
              </div>
              <div style={{ marginLeft: "30px" }}>
                <Autocomplete
                  id='combo-box-demo'
                  options={groups.filter(
                    (group) => !newGroup.find((g) => group === g)
                  )}
                  defaultValue={defaultGroup.map(({ number }) => number)}
                  getOptionSelected={(_, a) => {
                    setNewGroups((data) =>
                      newGroup.filter((b) => a === b).length === 0
                        ? [...data, a]
                        : data
                    );
                  }}
                  getOptionLabel={(group) => group}
                  selectOnFocus={true}
                  multiple
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
              <div>
                <Autocomplete
                  id='combo-box-demo'
                  options={act}
                  getOptionSelected={(data, a) => {
                    setLastActName(a);
                  }}
                  getOptionLabel={(name) => name}
                  selectOnFocus={true}
                  style={{ width: 400 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={(e) => setActName(e.target.value)}
                      variant='outlined'
                      label='Введите  название предмета'
                      fullWidth
                    />
                  )}
                />
              </div>
              <Button
                onClick={() => {
                  fetch(`${API_URL}/users/setUserGroups`, {
                    method: "post",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `login=${login}&groups=${newGroup.join(
                      "_"
                    )}&activity=${lastActname}`,
                  }).catch((e) => {
                    alert("Упс... Ошибка на сервере, попробуйте позже");
                  });
                }}
              >
                Отправить
              </Button>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            Выйти
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default RecoveryPass;
