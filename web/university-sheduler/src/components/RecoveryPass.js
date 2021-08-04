import React, { useState } from "react";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { API_URL } from "../variables";

const RecoveryPass = ({ open, setOpen, token }) => {
  const [pass, setPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const handleClose = () => {};

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Смена пароля</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Ваш пароль'
            type='password'
            fullWidth
            onChange={(e) => setPass(e.target.value)}
          />
          <TextField
            margin='dense'
            id='name'
            label='Новый пароль'
            type='password'
            fullWidth
            onChange={(e) => setNewPass(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            отмена
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              if (pass && newPass) {
                fetch(`${API_URL}/account/newPassword`, {
                  method: "post",
                  headers: {
                    Token: token,
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: `oldPassword=${pass}&newPassword=${newPass}`,
                });
              } else {
                alert("Заполните все поля");
              }
            }}
            color='primary'
          >
            Сменить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default RecoveryPass;
