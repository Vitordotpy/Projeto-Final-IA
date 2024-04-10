import { useEffect, useState } from "react";
import { CheckCircle } from "react-feather";
import { generateSudoku } from "../../utils/generateSudoku";

import Section from "../section";
import SudokuBoard from "./sudokuBoard";

function Sudoku() {
  const emptySudoku = Array.from({ length: 9 }, () => Array(9).fill(0));
  const [loading, setLoading] = useState(false);

  const [matrix, setMatrix] = useState({
    sudokuInitial: emptySudoku,
    sudoku: emptySudoku,
  });

  const [iterations, setIterations] = useState(0);

  const [algorithm, setAlgorithm] = useState("Simulated");

  const setSudokuDifficulty = (difficulty) => {
    const newSudoku = generateSudoku(difficulty);
    setMatrix({ sudokuInitial: newSudoku, sudoku: newSudoku });
  };

  const handleChange = (e) => {
    const { row, col } = e.key;
    const value = e.value;

    setMatrix((prevMatrix) => {
      if (prevMatrix.sudokuInitial[row][col] === 0) {
        const newSudoku = [...prevMatrix.sudoku];
        const newRow = [...newSudoku[row]];
        newRow[col] = value;
        newSudoku[row] = newRow;
        return { ...prevMatrix, sudoku: newSudoku };
      } else {
        return prevMatrix;
      }
    });
  };

  const simulatedInput = [
    { label: "Número de iterações", value: null, checkbox: true },
    { label: "Temperatura inicial", value: null, checkbox: true },
    { label: "Taxa de resfriamento", value: 0.99, checkbox: false },
    { label: "Reaquecimento", value: 0.98, checkbox: false },
    {
      label: "Reaquecimento após quantas iterações",
      value: 5000,
      checkbox: false,
    },
  ];

  const geneticInput = [
    { label: "Tamanho da população", value: 1400, checkbox: false },
    { label: "Taxa de crossover randômico", value: 0.45, checkbox: false },
    { label: "Taxa de crossover ranking", value: 0.55, checkbox: false },
    { label: "Taxa de mutação", value: 0.15, checkbox: false },
    { label: "Porcentagem da população mantida", value: 0.25, checkbox: false },
    { label: "Numero de gerações", value: 100, checkbox: false },
  ];

  const [inputs, setInputs] = useState(simulatedInput);

  const solverSudoku = async () => {
    const copy = JSON.parse(JSON.stringify(matrix.sudokuInitial));
    let solved;

    if (algorithm === "Simulated") {
      let iterationsInput = inputs[0].value;
      let initialTemperature = inputs[1].value;
      let coolingRate = +inputs[2].value;
      let reheating = +inputs[3].value;
      let reheatingIterations = +inputs[4].value;

      setLoading(true);
      if (window.Worker) {
        const worker = new Worker(new URL("./worker.js", import.meta.url));

        worker.postMessage({
          sudoku: copy,
          iterationsInput,
          initialTemperature,
          coolingRate,
          reheating,
          reheatingIterations,
        });

        worker.onmessage = (event) => {
          let infos = event.data;
          solved = infos.sudoku.state;
          setIterations(infos.iteration);

          setMatrix((prevMatrix) => ({
            ...prevMatrix,
            sudoku: solved,
          }));

          worker.terminate();
          setLoading(false);
        };
      }
    } else {
      let tamPop = +inputs[0].value;
      let crossoverRandom = +inputs[1].value;
      let crossoverRanking = +inputs[2].value;
      let mutation = +inputs[3].value;
      let keepPop = +inputs[4].value;
      let numGenerations = +inputs[5].value;

      if (window.Worker) {
        setLoading(true);
        const worker = new Worker(new URL("./worker2.js", import.meta.url));

        worker.postMessage({
          sudoku: copy,
          tamPop,
          crossoverRandom,
          crossoverRanking,
          mutation,
          keepPop,
          numGenerations,
        });

        worker.onmessage = (event) => {
          let infos = event.data;
          solved = infos.sudoku.state;
          setIterations(infos.generations);

          setMatrix((prevMatrix) => ({
            ...prevMatrix,
            sudoku: solved,
          }));

          setLoading(false);
          worker.terminate();
        };
      }
    }
  };

  useEffect(() => {
    console.log(inputs[0].value);
  }, [inputs]);

  return (
    <div className="App">
      <div className="container">
        <SudokuBoard sudoku={matrix} onChange={handleChange} />
        <Section
          loading={loading}
          solverSudoku={solverSudoku}
          setSudokuDifficulty={setSudokuDifficulty}
          setAlgorithm={setAlgorithm}
          algorithm={algorithm}
          simulatedInput={simulatedInput}
          geneticInput={geneticInput}
          inputs={inputs}
          setInputs={setInputs}
        ></Section>
      </div>
      <div className="infos">
        <p>
          <CheckCircle
            style={{ paddingRight: "4px" }}
            color="green"
            size={16}
          />{" "}
          {algorithm === "Simulated" ? "Iterações" : "Gerações"}: {iterations}
        </p>
      </div>
    </div>
  );
}

export default Sudoku;
