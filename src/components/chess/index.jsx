import { useState } from "react";
import Chessboard from "./chessBoard";
import "./style.css";

export function Chess() {
  const [difficulty, setDificulty] = useState(1);
  return (
    <div class="containerXadrez">
      <div className="xadrez">
        <h2>XADREZ IA</h2>

        <h3>Nivel de dificuldade</h3>

        <div className="flex-buttons">
          <button
            className={difficulty === 1 ? "active" : null}
            style={{ backgroundColor: "#1ac771" }}
            onClick={() => setDificulty(1)}
          >
            Fácil
          </button>
          <button
            className={difficulty === 2 ? "active" : null}
            style={{ backgroundColor: "#c3d40b" }}
            onClick={() => setDificulty(2)}
          >
            Médio
          </button>
          <button
            className={difficulty === 3 ? "active" : null}
            style={{ backgroundColor: "#c72047" }}
            onClick={() => setDificulty(3)}
          >
            Difícil
          </button>
        </div>
      </div>

      <Chessboard difficulty={difficulty} />
    </div>
  );
}

export default Chess;
