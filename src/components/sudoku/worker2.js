import { Solver } from "../../algorithms/genetic";

// primesWorker.js
onmessage = (event) => {
  const {
    sudoku,
    tamPop,
    crossoverRandom,
    crossoverRanking,
    mutation,
    keepPop,
    numGenerations,
  } = event.data;

  const result = Solver(
    sudoku,
    tamPop,
    crossoverRandom,
    crossoverRanking,
    mutation,
    keepPop,
    numGenerations
  );

  postMessage(result);
};
