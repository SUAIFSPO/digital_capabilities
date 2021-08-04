import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { API_URL } from "../variables";

const RecoveryPass = ({ open, setOpen }) => {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [groups, setGroups] = useState("");
  const [fio, setFio] = useState("");
  const [link, setLink] = useState("");
  const handleClose = () => {};
  const token = useSelector(({ commonReducer }) => commonReducer.token);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Добавление занятия</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Название предмета'
            fullWidth
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label='Дата начала'
            style={{
              marginRight: "50px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
            type='datetime-local'
            onChange={(e) => setStart(e.target.value)}
            defaultValue='2017-05-24T10:30'
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label='Дата  оконца'
            style={{
              marginRight: "30px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
            type='datetime-local'
            onChange={(e) => setEnd(e.target.value)}
            defaultValue='2017-05-24T10:30'
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin='dense'
            label='Введите названия групп, через точку с запятой'
            fullWidth
            onChange={(e) => setGroups(e.target.value)}
          />

          <TextField
            margin='dense'
            label='ФИО преподавателя'
            fullWidth
            onChange={(e) => setFio(e.target.value)}
          />
          <TextField
            margin='dense'
            label='Ссылка для подключение'
            fullWidth
            onChange={(e) => setLink(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            отмена
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              if (name && start && end && fio && link && groups) {
                fetch(`${API_URL}/activities/create`, {
                  method: "post",
                  headers: {
                    Token: `${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: `activity.name=${name}&activity.startTime=${start}&activity.endTime=${end}&activity.fio=${fio}&activity.link=${link}&listeners=${groups}`,
                });
              } else {
                alert("Заполните все поля");
              }
            }}
            color='primary'
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default RecoveryPass;
