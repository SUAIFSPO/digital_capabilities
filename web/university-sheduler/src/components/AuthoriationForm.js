import { useState } from "react";
import { TextField, Button } from "@material-ui/core";
const AuthorizationForm = () => {
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const onClick = () => {
    alert(login);
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
        onChange={(e) => setPass(e.target.value)}
      />
      <br />
      <Button onClick={onClick}>Войти</Button>
      <p>восстановить пароль</p>
    </div>
  );
};
export default AuthorizationForm;
