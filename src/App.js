import { PieChart } from "react-minimal-pie-chart";

import Header from "./components/header.js";
import Button from "./components/button.js";
import FirestoreGames from "./components/games.js";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <Header />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <hr></hr>
      {/* <Button /> */}

      <FirestoreGames/>

      
    </div>
  );
}

export default App;
