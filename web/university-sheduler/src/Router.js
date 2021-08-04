import { Switch, Route } from "react-router-dom";
import AuthorizationPage from "./pages/AuthorizationPage";
export default () => {
  return (
    <Switch>
      <Route path='/auth'>
        <AuthorizationPage />
      </Route>
    </Switch>
  );
};
