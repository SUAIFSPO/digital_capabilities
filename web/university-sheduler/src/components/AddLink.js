import React, { useState } from "react";
import { useSelector } from "react-redux";
import validUrl from "valid-url";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { API_URL } from "../variables";

const AddLink = ({ open, setOpen, id }) => {
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
        <DialogTitle id='form-dialog-title'>
          Добавление ссылки на урок и материалы к нему
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Ссылка на урок и материалы'
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
              if (validUrl.isUri(link)) {
                fetch(`${API_URL}/activities/setLink`, {
                  method: "post",

                  headers: {
                    Token: token,
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: `newLink=${link}&id=${id}`,
                });
                console.log(token);
              } else {
                alert("URL не корректен");
              }
              setOpen(false);
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
export default AddLink;
