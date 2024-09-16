import Header from "./components/header.js";
import Main from "./components/Main.js";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <Header />
      <div style={{ height: "122px" }}></div>

      <Main />
    </div>
  );
}

export default App;
