import { useEffect } from "react";
import { useSelector } from "react-redux";
import Router from "./Router";
import NavBar from "./components/NavBar";

function App() {
  const token = useSelector(({ commonReducer }) => commonReducer.token);
  return (
    <div className='App'>
      {token && <NavBar token={token} />}
      <Router />
    </div>
  );
}

export default App;
