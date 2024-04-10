import { simulated } from "../../algorithms/simulatedAnnealing";

// primesWorker.js
onmessage = (event) => {
  const {
    sudoku,
    iterationsInput,
    initialTemperature,
    coolingRate,
    reheating,
    reheatingIterations,
  } = event.data;
  const result = simulated(
    sudoku,
    reheatingIterations,
    reheating,
    initialTemperature,
    coolingRate,
    iterationsInput
  );
  console.log(event.data);
  postMessage(result);
};
