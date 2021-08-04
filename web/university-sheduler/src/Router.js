import { Switch, Route } from "react-router-dom";
import AuthorizationPage from "./pages/AuthorizationPage";
import ShedulerPage from "./pages/Sheduler";
export default () => {
  return (
    <Switch>
      <Route path='/auth'>
        <AuthorizationPage />
      </Route>
      <Route path='/sheduler'>
        <ShedulerPage />
      </Route>
    </Switch>
  );
};
