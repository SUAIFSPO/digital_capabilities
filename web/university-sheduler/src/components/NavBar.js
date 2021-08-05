import { useState } from "react";
import { Button } from "@material-ui/core";
import RecoveryPass from "./RecoveryPass";
import AddStudent from "./AddStudent";
import { useDispatch, useSelector } from "react-redux";
import AddAct from "./AddActivity";
import SetRole from "./SetRole";
import { API_URL } from "../variables";
function NavBar({ token }) {
  const dispatch = useDispatch();
  const isAdmin = useSelector(
    ({ commonReducer }) => commonReducer.type === "administrator"
  );
  const [open, setOpen] = useState(false);
  const [openAct, setOpenAct] = useState(false);
  const [openS, setOpenS] = useState(false);
  const [openR, setOpenR] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Button
        variant='contained'
        color='secondary'
        onClick={() => dispatch({ type: "SIGN_OUT" })}
      >
        Выйти
      </Button>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Восстановить пароль
      </Button>
      {isAdmin && (
        <div>
          <a href={`${API_URL}/activities/export`} download>
            Экспорт
          </a>
          <input
            style={{ marginLeft: "15px" }}
            type='file'
            onChange={(e) => {
              const data = e.target.files[0];
              const formData = new FormData();
              formData.append("file", data);
              fetch(`${API_URL}/activities/import`, {
                method: "POST",
                body: formData,
              });
            }}
          />
          <Button
            onClick={() => {
              setOpenAct(true);
            }}
          >
            Добавить занятие
          </Button>
          <Button
            onClick={() => {
              setOpenS(true);
            }}
          >
            Добавить студентов
          </Button>
          <Button
            onClick={() => {
              setOpenR(true);
            }}
          >
            Назначить роль
          </Button>
        </div>
      )}
      <RecoveryPass open={open} setOpen={setOpen} token={token} />
      {openAct && <AddAct open={openAct} setOpen={setOpenAct} />}
      {openS && <AddStudent open={openS} setOpen={setOpenS} />}
      {openR && <SetRole open={openR} setOpen={setOpenR} />}
    </div>
  );
}

export default NavBar;
