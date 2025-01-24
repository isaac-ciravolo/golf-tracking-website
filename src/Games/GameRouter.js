import { Routes, Route } from "react-router-dom";
import EditGameView from "./EditGameView";
import EditHoleView from "./EditHoleView";

const GameRouter = ({ userId }) => {
  return (
    <Routes>
      <Route path="" element={<EditGameView userId={userId} />} />
      <Route path=":holeIndex" element={<EditHoleView />} />
    </Routes>
  );
};

export default GameRouter;
