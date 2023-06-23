import Routings from "./Routings";
import Header from "./components/Header";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Header/>
        <Routings/>
      </Router>
    </>
  );
}

export default App;
