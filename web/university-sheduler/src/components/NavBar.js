import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import RecoveryPass from "./RecoveryPass";
import AddStudent from "./AddStudent";
import { useDispatch, useSelector } from "react-redux";
import AddAct from "./AddActivity";
import { API_URL } from "../variables";
function NavBar({ token }) {
  const dispatch = useDispatch();
  const isAdmin = useSelector(
    ({ commonReducer }) => commonReducer.type === "administrator"
  );
  const [open, setOpen] = useState(false);
  const [openAct, setOpenAct] = useState(false);
  const [openS, setOpenS] = useState(false);
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
            onChange={async (e) => {
              const data = e.target.files[0];
              const formData = new FormData();
              formData.append("file", data);

              const response = await fetch(`${API_URL}/activities/import`, {
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
        </div>
      )}
      <RecoveryPass open={open} setOpen={setOpen} token={token} />
      <AddAct open={openAct} setOpen={setOpenAct} />
      <AddStudent open={openS} setOpen={setOpenS} />
    </div>
  );
}

export default NavBar;
