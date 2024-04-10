class SudokuC {
  constructor(initialState) {
    this.initial = this.cloneSudoku(initialState);
    this.state = initialState;
  }

  //Cópia do Sudoku
  cloneSudoku(sudoku) {
    return sudoku.map((row) => [...row]);
  }

  //Preenche os zeros do Sudoku
  fillSudoku() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const getRandomNumber = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    const isUniqueInBlock = (row, col, num) => {
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let m = startRow; m < startRow + 3; m++) {
        for (let n = startCol; n < startCol + 3; n++) {
          if (this.state[m][n] === num) {
            return false;
          }
        }
      }
      return true;
    };

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.state[i][j] === 0) {
          const blockNumbers = new Set(
            numbers.filter((num) => isUniqueInBlock(i, j, num))
          );
          if (blockNumbers.size === 1) {
            this.state[i][j] = blockNumbers.values().next().value;
          } else if (blockNumbers.size > 1) {
            this.state[i][j] = getRandomNumber([...blockNumbers]);
          }
        }
      }
    }
  }

  //Calcula o somatório de erros por linha e coluna

  countRepeatsInRowsAndColumns() {
    let total = 0;

    for (let i = 0; i < 9; i++) {
      let rowNumbers = new Array(10).fill(0);
      let colNumbers = new Array(10).fill(0);
      for (let j = 0; j < 9; j++) {
        let rowNumber = this.state[i][j];
        let colNumber = this.state[j][i];
        if (rowNumber !== 0) {
          rowNumbers[rowNumber]++;
          if (rowNumbers[rowNumber] > 1) {
            total++;
          }
        }
        if (colNumber !== 0) {
          colNumbers[colNumber]++;
          if (colNumbers[colNumber] > 1) {
            total++;
          }
        }
      }
    }

    return total;
  }

  //Imprime o Sudoku
  printSudoku() {
    let output = "";
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        output += this.state[i][j] + " ";
        if ((j + 1) % 3 === 0 && j < 8) {
          output += "| ";
        }
      }
      output += "\n";
      if ((i + 1) % 3 === 0 && i < 8) {
        output += "------+-------+------\n";
      }
    }
    console.log(output);
  }

  //Troca duas células aleatórias num bloco aleatório
  swapInRandomBlock() {
    let blocks = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Lista de índices

    for (let i = blocks.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    }

    for (let b = 0; b < blocks.length; b++) {
      let blockIndex = blocks[b];

      let startRow = Math.floor(blockIndex / 3) * 3;
      let startCol = (blockIndex % 3) * 3;

      let positions = [];
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          if (this.initial[i][j] === 0) {
            positions.push([i, j]);
          }
        }
      }

      if (positions.length >= 2) {
        let index1 = Math.floor(Math.random() * positions.length);
        let pos1 = positions[index1];
        positions.splice(index1, 1);

        let index2 = Math.floor(Math.random() * positions.length);
        let pos2 = positions[index2];

        let temp = this.state[pos1[0]][pos1[1]];
        this.state[pos1[0]][pos1[1]] = this.state[pos2[0]][pos2[1]];
        this.state[pos2[0]][pos2[1]] = temp;

        return this.state;
      }
    }

    console.log("Não há blocos com posições suficientes para trocar.");
    return this.state;
  }

  //FUNCAO DE MUTACAO
  chanceMutation(mutation) {
    if (Math.random() < mutation) {
      this.swapInRandomBlock();
    }
  }
}

function compare(a, b) {
  const somaA = a.countRepeatsInRowsAndColumns();
  const somaB = b.countRepeatsInRowsAndColumns();

  return somaA - somaB;
}

//FUNCAO DE MUTACAO
function mutationFunc(child, mutationT) {
  child.chanceMutation(mutationT);
}

//FUNCAO DE CRIACAO DE POPULACAO NO COMEÇO DO CÓDIGO DE FORMA RANDOMIZADA
function createPopulation(sudoku, size) {
  let population = [];

  for (let i = 0; i < size; i++) {
    let sudokuRandom = new SudokuC(JSON.parse(JSON.stringify(sudoku.initial)));
    sudokuRandom.fillSudoku();

    population.push(sudokuRandom);
  }
  return population;
}

//SORTEIA A POPULACAO PELA FITNESS

function rankPopulation(population) {
  const sortedArray = [...population].sort(compare);
  return sortedArray;
}

//PEGA DOIS DE DETERMINADA POPULACA
function pickFromPopulation(
  rankedPopulation,
  selectionRate,
  randomSelectionRate
) {
  let nextBreeders = [];

  const nbBestToSelect = Math.floor(rankedPopulation.length * selectionRate);
  const nbRandomToSelect = Math.floor(
    rankedPopulation.length * randomSelectionRate
  );
  for (let i = 0; i < nbBestToSelect; i++) {
    nextBreeders.push(rankedPopulation[i]);
  }
  for (let i = 0; i < nbRandomToSelect; i++) {
    const randomIndex = Math.floor(Math.random() * rankedPopulation.length);
    nextBreeders.push(rankedPopulation[randomIndex]);
  }

  shuffleArray(nextBreeders);
  while (nextBreeders[0] === nextBreeders[1]) {
    shuffleArray(nextBreeders);
  }

  return { father: nextBreeders[0], mother: nextBreeders[1] };
}

//EMBARALHA ARRAY DE POPULACAO
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//FAZ A FUSAO DE DOIS SUDOKUS PAIS, FUNCAO REPRODUCE
function mergeSudokus(sudokuPai, sudokuMae) {
  const sudoku1 = JSON.parse(JSON.stringify(sudokuPai.state));
  const sudoku2 = JSON.parse(JSON.stringify(sudokuMae.state));
  let novoSudoku = [];
  let blocosUsados = { sudoku1: [], sudoku2: [] };

  for (let i = 0; i < 9; i++) {
    novoSudoku[i] = [];
    for (let j = 0; j < 9; j++) {
      let bloco = Math.floor(i / 3) * 3 + Math.floor(j / 3);
      let sudokuEscolhido;

      if (blocosUsados.sudoku1.includes(bloco)) {
        sudokuEscolhido = sudoku1;
      } else if (blocosUsados.sudoku2.includes(bloco)) {
        sudokuEscolhido = sudoku2;
      } else {
        sudokuEscolhido = Math.random() < 0.5 ? sudoku1 : sudoku2;
        blocosUsados[sudokuEscolhido === sudoku1 ? "sudoku1" : "sudoku2"].push(
          bloco
        );
      }

      novoSudoku[i][j] = sudokuEscolhido[i][j];
    }
  }

  // Garante que pelo menos um bloco de cada sudoku seja usado

  function copiarBloco(origem, destino, bloco) {
    for (
      let i = Math.floor(bloco / 3) * 3;
      i < Math.floor(bloco / 3) * 3 + 3;
      i++
    ) {
      for (let j = (bloco % 3) * 3; j < (bloco % 3) * 3 + 3; j++) {
        destino[i][j] = origem[i][j];
      }
    }
  }

  if (blocosUsados.sudoku1.length === 0) {
    let bloco =
      blocosUsados.sudoku2[
        Math.floor(Math.random() * blocosUsados.sudoku2.length)
      ];
    copiarBloco(sudoku1, novoSudoku, bloco);
  } else if (blocosUsados.sudoku2.length === 0) {
    let bloco =
      blocosUsados.sudoku1[
        Math.floor(Math.random() * blocosUsados.sudoku1.length)
      ];
    copiarBloco(sudoku2, novoSudoku, bloco);
  }

  const novoSudo = new SudokuC(sudokuPai.initial);
  novoSudo.state = novoSudoku;
  return novoSudo;
}

//ALGORITMO RESPONSAVEL PELA CRIACAO DA PROXIMA GERACAO, É A FUNCAO GENETIC-ALGORITHM
function genetic(
  population,
  populationSize,
  crossoverRandom,
  crossoverRank,
  mutation,
  nextGenerationKeep
) {
  let sorted = rankPopulation(population);

  let newpopulation = sorted.slice(0, populationSize * nextGenerationKeep);

  while (newpopulation.length < populationSize) {
    let sudokus = pickFromPopulation(sorted, crossoverRank, crossoverRandom);

    let child = mergeSudokus(sudokus.mother, sudokus.father);
    mutationFunc(child, mutation);
    newpopulation.push(child);
  }
  return newpopulation;
}

//SOLUCIONADOR FINAL
function Solver(
  sudokuF,
  populationSize,
  crossoverRandom,
  crossoverRank,
  mutation,
  nextGenerationKeep,
  numMaxGenerations
) {
  let sudoku = new SudokuC(sudokuF);
  let population = createPopulation(sudoku, populationSize);
  let generations = 0;

  while (numMaxGenerations === null ? true : generations < numMaxGenerations) {
    let best = population[0].countRepeatsInRowsAndColumns();
    console.log(best, generations, numMaxGenerations);

    if (best === 0) break;

    if (best <= 2)
      population = genetic(
        population,
        populationSize,
        crossoverRandom,
        crossoverRank,
        1,
        0.3
      );
    else
      population = genetic(
        population,
        populationSize,
        crossoverRandom,
        crossoverRank,
        mutation,
        nextGenerationKeep
      );
    generations++;
  }

  return { sudoku: population[0], generations };
}

export { Solver };
