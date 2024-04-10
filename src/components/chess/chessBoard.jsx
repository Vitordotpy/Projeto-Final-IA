import React, { useState } from "react";
import bB from "./imgs/bB.png";
import bK from "./imgs/bK.png";
import bN from "./imgs/bN.png";
import bP from "./imgs/bP.png";
import bQ from "./imgs/bQ.png";
import bR from "./imgs/bR.png";
import wB from "./imgs/wB.png";
import wK from "./imgs/wK.png";
import wN from "./imgs/wN.png";
import wP from "./imgs/wP.png";
import wQ from "./imgs/wQ.png";
import wR from "./imgs/wR.png";

import "./style.css";
const Chessboard = ({ difficulty }) => {
  // Define initial state for the chessboard
  console.log(difficulty);
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("black"); // 'white' or 'black'
  const [gameOver, setGameOver] = useState(false);

  // Function to initialize the chessboard with pieces in their starting positions
  function initializeBoard() {
    // Implement logic to set up the initial board state
    return [
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      ["r", "n", "b", "q", "k", "b", "n", "r"],
    ];
  }

  // Function to handle the click event when a square on the board is clicked
  function handleSquareClick(row, col) {
    const squareClicked = board[row][col];
    // se uma peça não foi selecionada
    if (selectedPiece === null && squareClicked !== null) {
      // se for o player tal, seleciona a peça dele
      if (currentPlayer === "white") {
        if (squareClicked === squareClicked.toUpperCase()) {
          // Selecting a piece of the current player
          setSelectedPiece({ piece: squareClicked, row, col });
          console.log(
            `Player: '${currentPlayer}' selected: '${squareClicked}'`
          );
        }
      } else if (currentPlayer === "black") {
        if (squareClicked === squareClicked.toLowerCase()) {
          // Selecting a piece of the current player
          setSelectedPiece({ piece: squareClicked, row, col });
          console.log(
            `Player: '${currentPlayer}' selected: '${squareClicked}'`
          );
        }
      }
    } else if (selectedPiece !== null && squareClicked === null) {
      // Mover uma peça selecionada para a posição clicada se esta estiver vazia
      console.log(
        `Player: '${currentPlayer}' tried to move: '${selectedPiece.piece}' to (${row},${col})`
      );
      makeMove(row, col);
    } else if (selectedPiece !== null && squareClicked !== null) {
      // selecionar uma nova peça para o jogador atual se a peça da posição clicada for dele
      if (
        currentPlayer === "black" &&
        squareClicked === squareClicked.toLowerCase()
      ) {
        setSelectedPiece({ piece: squareClicked, row, col });
        console.log(`Player: '${currentPlayer}' selected: '${squareClicked}'`);
      } else if (
        currentPlayer === "white" &&
        squareClicked === squareClicked.toUpperCase()
      ) {
        setSelectedPiece({ piece: squareClicked, row, col });
        console.log(`Player: '${currentPlayer}' selected: '${squareClicked}'`);
      } else {
        // Capturar uma peça adversária se estiver na posição clicada e for um movimento válido
        console.log(
          `Player: '${currentPlayer}' tried to capture: '${squareClicked}'`
        );
        makeMove(row, col);
      }
    }
  }

  function makeMove(row, col) {
    const squareClicked = board[row][col];
    const validMoves = getValidMoves(
      selectedPiece.piece,
      selectedPiece.row,
      selectedPiece.col
    );
    if (validMoves.some((move) => move[0] === row && move[1] === col)) {
      const newBoard = [...board];
      newBoard[row][col] = selectedPiece.piece;
      newBoard[selectedPiece.row][selectedPiece.col] = null;
      setBoard(newBoard);

      if (squareClicked === "K" || squareClicked === "k") {
        console.log(`CHECK MATE! Player: '${currentPlayer} won!'`);
        setGameOver(true);
        setCurrentPlayer("black");
      } else {
        setCurrentPlayer("white"); // Switch turn
        getAIMove(difficulty + 1); // chama a função do minimax com a profundidade definida
      }
      setSelectedPiece(null);
    }
  }

  function getValidMoves(piece, row, col) {
    switch (piece.toLowerCase()) {
      case "p":
        return getValidPawnMoves(row, col);
      case "r":
        return getValidRookMoves(row, col);
      case "n":
        return getValidKnightMoves(row, col);
      case "b":
        return getValidBishopMoves(row, col);
      case "q":
        return getValidQueenMoves(row, col);
      case "k":
        return getValidKingMoves(row, col);
      default:
        return [];
    }
  }

  function getValidPawnMoves(row, col) {
    const validMoves = [];
    if (currentPlayer === "black") {
      // Movimento simples para frente
      if (row - 1 >= 0) {
        addValidMove(row - 1, col, validMoves);
        // Movimento duplo inicial
        if (row === 6) {
          addValidMove(row - 2, col, validMoves);
        }
      }
      // Captura diagonal esquerda
      if (row - 1 >= 0 && col - 1 >= 0) {
        addValidMove(row - 1, col - 1, validMoves);
      }
      // Captura diagonal direita
      if (row - 1 >= 0 && col + 1 <= 7) {
        addValidMove(row - 1, col + 1, validMoves);
      }
    } else if (currentPlayer === "white") {
      // Movimento simples para frente
      if (row + 1 <= 7) {
        addValidMove(row + 1, col, validMoves);

        // Movimento duplo inicial
        if (row === 1) {
          addValidMove(row + 2, col, validMoves);
        }
      }
      // Captura diagonal esquerda
      if (row + 1 <= 7 && col - 1 >= 0) {
        addValidMove(row + 1, col - 1, validMoves);
      }
      // Captura diagonal direita
      if (row + 1 <= 7 && col + 1 <= 7) {
        addValidMove(row + 1, col + 1, validMoves);
      }
    }
    return validMoves;
  }

  function getValidRookMoves(row, col) {
    const validMoves = [];
    // Verificar movimentos para cima
    for (let i = row - 1; i >= 0; i--) {
      if (board[i][col]) {
        addValidMove(i, col, validMoves);
        break;
      } else {
        addValidMove(i, col, validMoves);
      }
    }

    // Verificar movimentos para baixo
    for (let i = row + 1; i < 8; i++) {
      if (board[i][col]) {
        addValidMove(i, col, validMoves);
        break;
      } else {
        addValidMove(i, col, validMoves);
      }
    }

    // Verificar movimentos para a esquerda
    for (let j = col - 1; j >= 0; j--) {
      if (board[row][j]) {
        addValidMove(row, j, validMoves);
        break;
      } else {
        addValidMove(row, j, validMoves);
      }
    }

    // Verificar movimentos para a direita
    for (let j = col + 1; j < 8; j++) {
      if (board[row][j]) {
        addValidMove(row, j, validMoves);
        break;
      } else {
        addValidMove(row, j, validMoves);
      }
    }

    return validMoves;
  }

  function getValidKnightMoves(row, col) {
    const validMoves = [];
    const directions = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    for (let i = 0; i < directions.length; i++) {
      const newRow = row + directions[i][0];
      const newCol = col + directions[i][1];
      addValidMove(newRow, newCol, validMoves);
    }

    return validMoves;
  }

  function getValidBishopMoves(row, col) {
    const validMoves = [];
    // Verificar movimentos na diagonal superior esquerda
    let i = row - 1;
    let j = col - 1;
    while (i >= 0 && j >= 0) {
      if (board[i][j]) {
        addValidMove(i, j, validMoves);
        break;
      } else {
        addValidMove(i, j, validMoves);
      }
      i--;
      j--;
    }

    // Verificar movimentos na diagonal superior direita
    i = row - 1;
    j = col + 1;
    while (i >= 0 && j < 8) {
      if (board[i][j]) {
        addValidMove(i, j, validMoves);
        break;
      } else {
        addValidMove(i, j, validMoves);
      }
      i--;
      j++;
    }

    // Verificar movimentos na diagonal inferior esquerda
    i = row + 1;
    j = col - 1;
    while (i < 8 && j >= 0) {
      if (board[i][j]) {
        addValidMove(i, j, validMoves);
        break;
      } else {
        addValidMove(i, j, validMoves);
      }
      i++;
      j--;
    }

    // Verificar movimentos na diagonal inferior direita
    i = row + 1;
    j = col + 1;
    while (i < 8 && j < 8) {
      if (board[i][j]) {
        addValidMove(i, j, validMoves);
        break;
      } else {
        addValidMove(i, j, validMoves);
      }
      i++;
      j++;
    }
    return validMoves;
  }

  function getValidQueenMoves(row, col) {
    return getValidRookMoves(row, col).concat(getValidBishopMoves(row, col));
  }

  function getValidKingMoves(row, col) {
    const validMoves = [];
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let i = 0; i < directions.length; i++) {
      const newRow = row + directions[i][0];
      const newCol = col + directions[i][1];

      addValidMove(newRow, newCol, validMoves);
    }
    return validMoves;
  }

  // Helper function to add a valid move to the list of valid moves
  function addValidMove(row, col, validMoves) {
    if (isValidSquare(row, col)) {
      validMoves.push([row, col]);
    } else {
      return false;
    }
  }

  function isValidSquare(row, col) {
    // Verifica se a posição está dentro dos limites do tabuleiro
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      if (currentPlayer === "white") {
        // se o jogador atual for white
        if (board[row][col] === null) {
          // se a posição clicada estiver vazia
          return true;
        } else {
          // se a posição clicada estiver ocupada por uma peça do jogador oponente
          if (board[row][col] === board[row][col].toLowerCase()) {
            return true;
          } else {
            return false;
          }
        }
      } else if (currentPlayer === "black") {
        // se o jogador atual for black
        if (board[row][col] === null) {
          // se a posição clicada estiver vazia
          return true;
        } else {
          // se a posição clicada estiver ocupada por uma peça do jogador oponente
          if (board[row][col] === board[row][col].toUpperCase()) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }

  // ------- Minimax --------

  // baseado no código do usuário apostololisv no github que pode ser encontrado no endereço https://github.com/apostolisv/chess-ai/blob/master/

  // Pouco foi reaproveitado do código fonte por causa da lógica utilizada no nosso jogo.

  function makeDeepCopy(board) {
    return JSON.parse(JSON.stringify(board));
  }

  function getScore(piece) {
    switch (piece.toLowerCase()) {
      case "p":
        return 10;
      case "r":
        return 30;
      case "n":
        return 20;
      case "b":
        return 30;
      case "q":
        return 240;
      case "k":
        return 1000;
      default:
        return 0;
    }
  }

  // a função de avaliação, ela avalia o tabuleiro e retorna um valor de pontuação, como o xadrez é um jogo complexo, quanto mais métodos de avaliação, melhor será o resultado da avaliação, procurei varias fontes de avaliação para xadrez e fui adicionando, não possui todos mas acho que é suficiente para o jogo.
  function evaluate(newBoard) {
    let whitePoints = 0;
    let blackPoints = 0;
    // Avaliação baseada no material
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (newBoard[i][j] !== null) {
          const piece = newBoard[i][j];
          if (piece === piece.toUpperCase()) {
            whitePoints += getScore(piece);
          } else {
            blackPoints += getScore(piece);
          }
        }
      }
    }
    // Avaliação baseada na mobilidade das peças
    whitePoints += calculateMobility(newBoard, "white");
    blackPoints += calculateMobility(newBoard, "black");

    // Avaliação baseada na segurança do rei
    whitePoints -= calculateKingSafety(newBoard, "white");
    blackPoints -= calculateKingSafety(newBoard, "black");

    // Avaliação baseada na estrutura do tabuleiro
    whitePoints += evaluateBoardStructure(newBoard, "white");
    blackPoints += evaluateBoardStructure(newBoard, "black");

    return whitePoints - blackPoints; // pontuação para o formato de jogo brancas em cima e pretas em baixo
  }

  // Função para calcular a mobilidade das peças
  function calculateMobility(newBoard, color) {
    let mobility = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (
          newBoard[i][j] !== null &&
          (color === "white"
            ? newBoard[i][j] === newBoard[i][j].toUpperCase()
            : newBoard[i][j] === newBoard[i][j].toLowerCase())
        ) {
          const piece = newBoard[i][j];
          const moves = getValidMoves(piece, i, j);
          mobility += moves.length;
        }
      }
    }
    return mobility;
  }

  function calculateKingSafety(newBoard, color) {
    let kingSafety = 0;
    const kingPosition = findKingPosition(newBoard, color);
    if (kingPosition) {
      const [kingRow, kingCol] = kingPosition;
      // Verificar a proximidade das peças inimigas ao redor do rei
      for (let i = kingRow - 1; i <= kingRow + 1; i++) {
        for (let j = kingCol - 1; j <= kingCol + 1; j++) {
          if (
            isValidSquare(i, j) &&
            newBoard[i][j] &&
            (color === "white"
              ? newBoard[i][j] === newBoard[i][j].toLowerCase()
              : newBoard[i][j] === newBoard[i][j].toUpperCase())
          ) {
            kingSafety -= 1; // Penalizar por cada peça inimiga próxima ao rei
          }
        }
      }
      // Verificar se o rei está protegido por suas próprias peças
      const ownPieces = color === "white" ? "PNBRQK" : "pnbrqk";
      for (let i = kingRow - 1; i <= kingRow + 1; i++) {
        for (let j = kingCol - 1; j <= kingCol + 1; j++) {
          if (isValidSquare(i, j) && ownPieces.includes(newBoard[i][j])) {
            kingSafety += 1; // Recompensar por cada peça própria próxima ao rei
          }
        }
      }
    }
    return kingSafety;
  }

  function findKingPosition(newBoard, color) {
    const kingSymbol = color === "white" ? "K" : "k";
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (newBoard[i][j] === kingSymbol) {
          return [i, j];
        }
      }
    }
    return null;
  }

  function evaluateBoardStructure(newBoard, color) {
    let boardStructure = 0;
    // Verificar controle do centro do tabuleiro
    for (let i = 3; i <= 4; i++) {
      for (let j = 3; j <= 4; j++) {
        if (
          newBoard[i][j] &&
          (color === "white"
            ? newBoard[i][j] === newBoard[i][j].toUpperCase()
            : newBoard[i][j] === newBoard[i][j].toLowerCase())
        ) {
          boardStructure += 1; // Recompensar por cada peça própria no centro do tabuleiro
        }
      }
    }

    // Verificar peões isolados e dobrados
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = newBoard[i][j];
        if (
          piece &&
          (color === "white"
            ? piece === piece.toLowerCase()
            : piece === piece.toUpperCase())
        ) {
          // Verificar se a peça pertence ao jogador atual
          if (piece === "p" || piece === "P") {
            // Se a peça for um peão
            const adjacentFiles = getAdjacentFiles(i, j);

            // Verificar se o peão é isolado
            const isIsolated = adjacentFiles.every((fileIndex) => {
              return (
                newBoard[i][fileIndex] === null ||
                newBoard[i][fileIndex].toLowerCase() !== "p"
              );
            });

            // Verificar se o peão é dobrado
            const isDoubled =
              i > 0 &&
              newBoard[i - 1][j] &&
              (color === "white"
                ? newBoard[i - 1][j] === "p"
                : newBoard[i - 1][j] === "P");

            // Penalizar peões isolados e dobrados
            if (isIsolated) {
              boardStructure -= 1; // Penalizar peões isolados
            }
            if (isDoubled) {
              boardStructure -= 1; // Penalizar peões dobrados
            }
          }
        }
      }
    }
    let whiteDevelopment = 0;
    let blackDevelopment = 0;

    // Avaliar desenvolvimento das peças brancas
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (newBoard[i][j] && newBoard[i][j].toUpperCase() === newBoard[i][j]) {
          // Peça branca encontrada
          whiteDevelopment++;
          // Verificar se a peça está em uma posição ativa e bem conectada
          if (i >= 4 && i <= 5 && j >= 3 && j <= 4) {
            whiteDevelopment++; // Adicione pontos extras para peças em posições ativas
          }
        }
      }
    }

    // Avaliar desenvolvimento das peças pretas
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (newBoard[i][j] && newBoard[i][j].toLowerCase() === newBoard[i][j]) {
          // Peça preta encontrada
          blackDevelopment++;
          // Verificar se a peça está em uma posição ativa e bem conectada
          if (i >= 2 && i <= 3 && j >= 3 && j <= 4) {
            blackDevelopment++; // Adicione pontos extras para peças em posições ativas
          }
        }
      }
    }

    // Comparar desenvolvimento das peças e atribuir uma pontuação
    const developmentScore = whiteDevelopment - blackDevelopment;
    boardStructure += developmentScore;
    return boardStructure;
  }

  // Função para obter as posições adjacentes à posição atual
  function getAdjacentFiles(row, col) {
    const adjacentFiles = [];
    if (col > 0) {
      adjacentFiles.push(col - 1); // Esquerda
    }
    if (col < 7) {
      adjacentFiles.push(col + 1); // Direita
    }
    return adjacentFiles;
  }

  // Função para simular um movimento para o jogador max ou min
  function simulateMove(move_i, move_j, newBoard, piece_i, piece_j) {
    newBoard[move_i][move_j] = newBoard[piece_i][piece_j];
    newBoard[piece_i][piece_j] = null;
    return newBoard;
  }

  // Função principal do minimax que adquire a melhor jogada para cada jogador, como o jogador que interessa é o max ou seja a IA, então so retornamos a melhor jogada para o jogador max.
  function minimax(newBoard, depth, alpha, beta, maxPlayer, saveMove, data) {
    // caso base (necessita de aprimoramento pois a condição de finalização do jogo está incompleta)
    if (depth === 0 || gameOver) {
      data[1] = evaluate(newBoard);
      return data;
    }

    if (maxPlayer) {
      let maxEval = -Infinity;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          // se a célula não estiver vazia e for uma peça do jogador "white"
          if (
            newBoard[i][j] !== null &&
            newBoard[i][j] === newBoard[i][j].toUpperCase()
          ) {
            const piece = newBoard[i][j];
            // movimentos para a peça atual do jogador max (white)
            const moves = getValidMoves(piece, i, j);

            for (const move of moves) {
              // para cada movimento, fazemos uma cópia do tabuleiro para simular o movimento e avaliar esse novo tabuleiro, se a avaliação for maior que o maxEval, atualizamos o maxEval e o melhor movimento
              const newBoardPrevState = makeDeepCopy(newBoard);
              newBoard = simulateMove(move[0], move[1], newBoard, i, j);

              const evaluation = minimax(
                newBoard,
                depth - 1,
                alpha,
                beta,
                false,
                false,
                data
              )[1];

              if (saveMove) {
                if (evaluation >= maxEval) {
                  if (evaluation > data[1]) {
                    data.splice(0, data.length, [[[i, j], move, evaluation]]);
                    data[1] = evaluation;
                  } else if (evaluation === data[1]) {
                    data[0].push([[i, j], move, evaluation]);
                  }
                }
              }

              // desfazendo o movimento
              newBoard = newBoardPrevState;

              maxEval = Math.max(maxEval, evaluation);
              alpha = Math.max(alpha, evaluation);
              if (beta <= alpha) break;
            }
          }
        }
      }
      return data;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          // se a célula não estiver vazia e for uma peça do jogador "black"
          if (
            newBoard[i][j] !== null &&
            newBoard[i][j] === newBoard[i][j].toLowerCase()
          ) {
            const piece = newBoard[i][j];
            // movimentos para a peça atual do jogador min (black)
            const moves = getValidMoves(piece, i, j);
            for (const move of moves) {
              const newBoardPrevState = makeDeepCopy(newBoard);

              newBoard = simulateMove(move[0], move[1], newBoard, i, j);

              const evaluation = minimax(
                newBoard,
                depth - 1,
                alpha,
                beta,
                true,
                false,
                data
              )[1];

              // desfazendo o movimento
              newBoard = newBoardPrevState;

              minEval = Math.min(minEval, evaluation);
              beta = Math.min(beta, evaluation);
              if (beta <= alpha) break;
            }
          }
        }
      }
      return data;
    }
  }

  function getAIMove(depth) {
    let newBoard = makeDeepCopy(board);
    const moves = minimax(newBoard, depth, -Infinity, Infinity, true, true, [
      [],
      0,
    ]);
    // verificar se o minimax retornou movimentos
    if (moves[0].length === 0) {
      // primeiro movimento da IA
      const start_moves = [
        [
          [1, 5],
          [3, 5],
        ],
        [
          [1, 4],
          [3, 4],
        ],
      ];
      const random = Math.floor(Math.random() * start_moves.length);
      const piece = start_moves[random][0];
      const move = start_moves[random][1];
      newBoard[move[0]][move[1]] = board[piece[0]][piece[1]];
      newBoard[piece[0]][piece[1]] = null;
      setBoard(newBoard);
      setCurrentPlayer("black"); // Switch turn
      return false;
    }
    const bestScore = Math.max(...moves[0].map((move) => move[2]));
    const pieceAndMove = moves[0].find((move) => move[2] === bestScore);
    const piece = pieceAndMove[0];
    const move = pieceAndMove[1];

    // fazer o movimento (está redundante, pode ser melhorado posteriormente)
    if (piece && move) {
      const newBoard = [...board];
      if (
        newBoard[move[0]][move[1]] !== null &&
        newBoard[move[0]][move[1]] === "k"
      ) {
        console.log(`CHECK MATE! Player: 'White won!'`);
        setGameOver(true);
        setCurrentPlayer("black");
      } else {
        newBoard[move[0]][move[1]] = board[piece[0]][piece[1]];
        newBoard[piece[0]][piece[1]] = null;
        setBoard(newBoard);
        setCurrentPlayer("black"); // Switch turn
      }

      return true;
    }
  }

  // ------- Minimax --------

  // Render the chessboard UI
  return (
    <div>
      <div className="chessboard">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((square, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`square ${
                  (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
                }`}
                onClick={() =>
                  !gameOver ? handleSquareClick(rowIndex, colIndex) : null
                }
              >
                {square && <Piece piece={square} />}
              </div>
            ))}
          </div>
        ))}
      </div>
      {gameOver ? (
        <div align-items="center" flex="flex-col">
          Player {currentPlayer} Won
          <button
            onClick={() => {
              setGameOver(!gameOver);
              setBoard(initializeBoard());
            }}
            className="button"
          >
            Restart Game
          </button>
        </div>
      ) : null}
    </div>
  );
};

const Piece = ({ piece }) => {
  let pieceImage;
  switch (piece) {
    case "P":
      pieceImage = <img src={wP} alt="white pawn" />;
      break;
    case "R":
      pieceImage = <img src={wR} alt="white rook" />;
      break;
    case "N":
      pieceImage = <img src={wN} alt="white knight" />;
      break;
    case "B":
      pieceImage = <img src={wB} alt="white bishop" />;
      break;
    case "Q":
      pieceImage = <img src={wQ} alt="white queen" />;
      break;
    case "K":
      pieceImage = <img src={wK} alt="white king" />;
      break;
    case "p":
      pieceImage = <img src={bP} alt="black pawn" />;
      break;
    case "r":
      pieceImage = <img src={bR} alt="black rook" />;
      break;
    case "n":
      pieceImage = <img src={bN} alt="black knight" />;
      break;
    case "b":
      pieceImage = <img src={bB} alt="black bishop" />;
      break;
    case "q":
      pieceImage = <img src={bQ} alt="black queen" />;
      break;
    case "k":
      pieceImage = <img src={bK} alt="black king" />;
      break;
    default:
      pieceImage = piece;
  }

  return <div className="piece">{pieceImage}</div>;
};

export default Chessboard;
