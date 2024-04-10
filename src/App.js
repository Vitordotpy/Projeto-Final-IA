import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Chess from "./components/chess";
import Header from "./components/header";
import Sudoku from "./components/sudoku";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Sudoku />} path="" />
          <Route element={<Chess />} path="chess" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
