import "./App.css";
import { useEffect } from "react";
import Router from "./Router";

function App() {
  useEffect(() => {
    fetch("192.168.0.42:5000/main/test").then(console.log);
  });
  return (
    <div className='App'>
      <Router />
    </div>
  );
}

export default App;
