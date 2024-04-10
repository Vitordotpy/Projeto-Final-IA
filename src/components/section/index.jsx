import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./style.css";

export function Section({
  setSudokuDifficulty,
  solverSudoku,
  setAlgorithm,
  algorithm,
  inputs,
  setInputs,
  geneticInput,
  simulatedInput,
  loading,
}) {
  const [checkboxes, setCheckboxes] = useState(
    Array(simulatedInput.length).fill(true)
  ); // Alteração aqui

  const handleInputChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index].value = event.target.value; // Permite apenas números
    setInputs(newInputs);
  };

  const handleCheckboxChange = (index) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index] = !newCheckboxes[index];
    setCheckboxes(newCheckboxes);

    const newInputs = [...inputs];
    if (newCheckboxes[index]) {
      newInputs[index].value = null;
      console.group(inputs);
    }
    setInputs(newInputs);
  };

  return (
    <div className="section">
      <div>
        <p>Gerar Sudoku</p>
        <div className="flex-buttons">
          <button
            style={{ backgroundColor: "#1ac771" }}
            onClick={() => setSudokuDifficulty(1)}
          >
            Fácil
          </button>
          <button
            style={{ backgroundColor: "#c3d40b" }}
            onClick={() => setSudokuDifficulty(2)}
          >
            Médio
          </button>
          <button
            style={{ backgroundColor: "#c72047" }}
            onClick={() => setSudokuDifficulty(3)}
          >
            Difícil
          </button>
        </div>
      </div>

      <div className="algorithm">
        <p>Algoritmo</p>
        <select
          value={algorithm}
          onChange={(e) => {
            setAlgorithm(e.target.value);
            setInputs(
              e.target.value === "Genético" ? geneticInput : simulatedInput
            );
          }}
        >
          <option value="Simulated">Simulated Annealing</option>
          <option value="Genético">Genético</option>
        </select>
      </div>
      <p className="caution">
        Atenção: dependendo da maneira como você dimensiona esses dados, pode
        ser que o Sudoku nunca ache uma solução. OBS: Caso o checkbox esteja
        marcado, o algoritmo gerenciará os valores
      </p>

      <div className="container-grid">
        {inputs.map((input, index) => (
          <div key={index} className="input-container">
            <label>
              {input.label}
              {input.checkbox && (
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={checkboxes[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
              )}
            </label>

            <input
              type="text"
              value={input.value == null ? "" : input.value}
              onChange={(e) => handleInputChange(index, e)}
              disabled={input.checkbox && checkboxes[index]} // Disable input if checkbox is checked
            />
          </div>
        ))}

        <div>
          <label> &nbsp;</label>
          <button style={{ backgroundColor: "#d3d3d3" }}>Resetar</button>
        </div>
      </div>

      <button style={{ backgroundColor: "#1e59b2" }} onClick={solverSudoku}>
        {loading ? <AiOutlineLoading3Quarters class="spinner" /> : null}{" "}
        Resolver o Sudoku
      </button>
    </div>
  );
}

export default Section;
