import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import RecoveryPass from "./RecoveryPass";
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
        </div>
      )}
      <RecoveryPass open={open} setOpen={setOpen} token={token} />
      <AddAct open={openAct} setOpen={setOpenAct} />
    </div>
  );
}

export default NavBar;
