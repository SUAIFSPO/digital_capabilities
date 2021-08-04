import { useState } from "react";
import { useDispatch } from "react-redux";
import { TextField, Button } from "@material-ui/core";

import { auth } from "../redux/common/actions";
const AuthorizationForm = () => {
  const getAuth = useDispatch();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isFetch, setIsFetch] = useState(false);
  const onClick = async () => {
    try {
      const details = { login, password };
      var formBody = [];
      for (var property in details) {
        formBody.push(property + "=" + details[property]);
      }
      formBody = formBody.join("&");
      setIsFetch(true);
      const data = await fetch("http://192.168.0.42:5000/auth/login", {
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody,
      }).then((data) => data.json());
      getAuth(auth(data));
    } catch {
      setIsFetch(false);
    }
  };
  return (
    <div className='authForm'>
      <TextField
        label='Логин'
        variant='outlined'
        onChange={(e) => setLogin(e.target.value)}
      />
      <br />
      <br />
      <TextField
        label='Пароль'
        variant='outlined'
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <Button onClick={onClick}>Войти</Button>
      <p>восстановить пароль</p>
    </div>
  );
};
export default AuthorizationForm;
