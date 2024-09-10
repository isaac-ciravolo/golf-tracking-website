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
      <Button />

      <FirestoreGames />

      <div style={{ width: "500px" }}>
        <PieChart
          data={[
            { title: "One", value: 1, color: "#E38627" },
            { title: "Two", value: 20, color: "#C13C37" },
            { title: "Three", value: 20, color: "#6A2135" },
          ]}
        />
      </div>
    </div>
  );
}

export default App;
