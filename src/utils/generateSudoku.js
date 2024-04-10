import { simulated } from "../algorithms/simulatedAnnealing";

// Função para criar, resolver e remover peças de um sudoku com base no nível
export function generateSudoku(nivel) {
  // Sudoku vazio
  const sudokuInicial = Array.from({ length: 9 }, () => Array(9).fill(0));

  // Níveis: fácil (1), médio (2), difícil (3)
  const pecasARemover = [40, 50, 60]; // Quantidade de peças a remover dependendo do nível

  const pecasRemovidas = pecasARemover[nivel - 1];

  const sudokuModificado = [...sudokuInicial]; // Clonando o sudoku inicial

  // Resolver o sudoku modificado
  const sudokuResolvido = simulated(sudokuModificado, 5000, 1, null, 0.99, null)
    .sudoku.state;

  const pecasRemovidasPosicoes = new Set(); // Conjunto de posições das peças removidas

  // Remover peças do sudoku resolvido
  while (pecasRemovidasPosicoes.size < pecasRemovidas) {
    const linha = Math.floor(Math.random() * 9);
    const coluna = Math.floor(Math.random() * 9);
    const posicao = `${linha},${coluna}`; // Formatar a posição como uma string

    // Verificar se a posição já foi removida, se sim, gerar uma nova posição
    if (pecasRemovidasPosicoes.has(posicao)) {
      continue;
    }

    sudokuResolvido[linha][coluna] = 0; // Substituindo a peça por zero
    pecasRemovidasPosicoes.add(posicao); // Adicionar a posição ao conjunto de peças removidas
  }

  return sudokuResolvido;
}
