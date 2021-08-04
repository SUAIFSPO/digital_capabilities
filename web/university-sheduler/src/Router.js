import { Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthorizationPage from "./pages/AuthorizationPage";
import ShedulerPage from "./pages/Sheduler";
const App = () => <Redirect to='/sheduler' />;
const App2 = () => <Redirect to='/auth' />;
export default () => {
  const token = useSelector(({ commonReducer }) => commonReducer.token);
  return (
    <Switch>
      <Route exact path='/auth' component={!token ? AuthorizationPage : App} />
      <Route path='/sheduler' component={token ? ShedulerPage : App2} />
    </Switch>
  );
};
