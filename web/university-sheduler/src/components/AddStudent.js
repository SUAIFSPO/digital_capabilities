import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FileDrop } from "react-file-drop";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { API_URL } from "../variables";
import "./ShedulerComponents/styles.css";

const AddStudent = ({ open, setOpen }) => {
  const [students, setStudents] = useState([]);
  const handleClose = () => {};
  const token = useSelector(({ commonReducer }) => commonReducer.token);
  const styles = {
    border: "1px solid black",
    width: 600,
    color: "black",
    height: "200px",
    textAlign: "center",
  };
  const onDrop = (files, event) => {
    const a = Array.from(files);
    const rightFiles = a.filter(({ name }) => name.split("_").length === 2);
    setStudents((data) => [...data, ...rightFiles]);
    console.log(a);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='form-dialog-title'
      maxWidth='lg'
    >
      <DialogTitle id='form-dialog-title'>Добавление занятия</DialogTitle>
      <DialogContent>
        <div style={styles}>
          <FileDrop onDrop={onDrop}>
            Перетащите Файлы сюда.
            <br />
            каждая фотография должна быть названа в формате: ФИО_номергруппы.jpg
            Или нажмите кнопку и выберете файлы
            <br />
            <div class='input__wrapper'>
              <input
                className='input__file'
                name='file'
                id='input__file'
                multiple
                accept='image/*'
                type='file'
                onChange={(event) => {
                  onDrop(event.target.files);
                }}
              />
              <label for='input__file' className='input__file-button'>
                <p className='text-p1'>Выберите файлы</p>
              </label>
            </div>
          </FileDrop>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeate(4,1fr)" }}>
          {students?.map((file, i) => (
            <div style={{ display: "flex" }} key={i}>
              <div style={{ position: "relative" }}>
                <img src={URL.createObjectURL(file)} width={300} />
                <p
                  className='deletePhoto'
                  onClick={() => {
                    setStudents((data) =>
                      data.filter((_, index) => index !== i)
                    );
                  }}
                >
                  X
                </p>
              </div>
              <p style={{ marginLeft: "15px" }}>{file.name}</p>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color='primary'>
          отмена
        </Button>
        <Button
          disabled={!students.length}
          onClick={() => {
            setOpen(false);
            if (students) {
              try {
                const formData = new FormData();
                students.forEach((file, i) => {
                  formData.append(`photos`, file);
                });
                fetch(`${API_URL}/users/loadPhotos`, {
                  method: "POST",
                  "Content-Type": "multipart/form-data",
                  body: formData,
                }).catch((error) => {
                  alert(error);
                });
              } catch (e) {}
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
  );
};
export default AddStudent;
