export class SudokuC {
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

  //Calcula os erros por linha e coluna

  countRepeatsInRowsAndColumns() {
    let total = 0;

    for (let i = 0; i < 9; i++) {
      let rowNumbers = new Array(10).fill(0); // Array to count occurrences of numbers 1-9 in the row
      let colNumbers = new Array(10).fill(0); // Array to count occurrences of numbers 1-9 in the column
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

  //Calcula o desvio padrao de 9 amostras
  calculateStandardDeviation() {
    function standardDeviation(values) {
      let avg = values.reduce((a, b) => a + b, 0) / values.length;
      let squareDiffs = values.map((value) => Math.pow(value - avg, 2));
      let avgSquareDiff =
        squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
      return Math.sqrt(avgSquareDiff);
    }

    let errorCounts = [];
    for (let i = 0; i < 9; i++) {
      let swappedSudoku = new SudokuC(this.swapInRandomBlock());
      let errorCount = swappedSudoku.countRepeatsInRowsAndColumns();
      errorCounts.push(errorCount);
    }

    let stdDev = standardDeviation(errorCounts);
    return stdDev;
  }

  //Função que troca duas células aleatórias num bloco aleatório

  swapInRandomBlock() {
    let sudokuCopy = JSON.parse(JSON.stringify(this.state));
    let blocks = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // índice para serem colocados

    // Embaralha o array
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

        let temp = sudokuCopy[pos1[0]][pos1[1]];
        sudokuCopy[pos1[0]][pos1[1]] = sudokuCopy[pos2[0]][pos2[1]];
        sudokuCopy[pos2[0]][pos2[1]] = temp;

        return sudokuCopy;
      }
    }

    console.log("Não há blocos com posições suficientes para trocar.");
    return sudokuCopy;
  }
}

//Função simulated
function simulated(
  sudokuF,
  stuckNum,
  stuchHeat,
  tempInitial,
  coldRate,
  numInterations
) {
  const sudoku = new SudokuC(sudokuF);
  sudoku.fillSudoku();

  let cost = sudoku.countRepeatsInRowsAndColumns();

  let sigma =
    tempInitial === null ? sudoku.calculateStandardDeviation() : tempInitial;
  let iteration = 0;
  let stuck = 0;

  while (numInterations === null ? true : iteration < numInterations) {
    if (cost === 0) break;
    if (stuck % stuckNum === 0) {
      sigma += stuchHeat;
      stuck = 0;
    }

    const newState = new SudokuC(sudoku.swapInRandomBlock());
    const newCost = newState.countRepeatsInRowsAndColumns();

    const delta = newCost - cost;

    if (delta < 0) {
      sudoku.state = newState.state;
      cost = newCost;
    } else {
      const probability = Math.exp(-delta / sigma);
      if (Math.random() < probability) {
        sudoku.state = newState.state;
        cost = newCost;
      }
    }

    iteration++;
    stuck++;
    sigma *= coldRate;
  }
  return { sudoku, iteration };
}

export { simulated };
