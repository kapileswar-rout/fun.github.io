const startGameButton = document.getElementById('start-game');
const newGameButton = document.getElementById('new-game');
const resetButton = document.getElementById('reset-game');
const gameSection = document.getElementById('game-section');
const playerSection = document.getElementById('player-section');
const playerDataSection = document.getElementById('player-data');
const errorMessage = document.getElementById('error-message');
const playerXInput = document.getElementById('player-x');
const playerOInput = document.getElementById('player-o');
const turnStatus = document.getElementById('status');
const cells = document.querySelectorAll('.cell');

let playerXStats = { wins: 0, losses: 0, draws: 0, totalGames: 0 };
let playerOStats = { wins: 0, losses: 0, draws: 0, totalGames: 0 };
let currentPlayer = 'X';
let gameActive = true;
let boardState = Array(9).fill(null);

function updatePlayerStats() {
  document.getElementById('player-x-name').textContent = playerXInput.value ? playerXInput.value : 'Player X';
  document.getElementById('player-o-name').textContent = playerOInput.value ? playerOInput.value : 'Player O';

  // Update stats with wins, losses, draws, and total games
  document.getElementById('player-x-wins').textContent = playerXStats.wins;
  document.getElementById('player-x-losses').textContent = playerXStats.losses;
  document.getElementById('player-x-draws').textContent = playerXStats.draws;
  document.getElementById('player-x-total-games').textContent = playerXStats.totalGames;

  document.getElementById('player-o-wins').textContent = playerOStats.wins;
  document.getElementById('player-o-losses').textContent = playerOStats.losses;
  document.getElementById('player-o-draws').textContent = playerOStats.draws;
  document.getElementById('player-o-total-games').textContent = playerOStats.totalGames;
}

startGameButton.addEventListener('click', () => {
  const playerX = playerXInput.value.trim();
  const playerO = playerOInput.value.trim();

  if (!playerX || !playerO) {
    errorMessage.classList.remove('hidden');
    return;
  }

  errorMessage.classList.add('hidden');
  playerSection.classList.add('hidden');
  gameSection.classList.remove('hidden');
  playerDataSection.classList.remove('hidden');
  updatePlayerStats();

  boardState = Array(9).fill(null); // Reset the board state
  gameActive = true;
  currentPlayer = 'X';
  turnStatus.textContent = `${playerXInput.value}'s turn (X)`;
});

newGameButton.addEventListener('click', () => {
  // Reset the board only but keep stats and player names
  boardState = Array(9).fill(null);  // Clear the board state
  gameActive = true;  // Activate the game
  currentPlayer = 'X';  // Start with Player X
  turnStatus.textContent = `${playerXInput.value}'s turn (X)`;  // Update turn status

  // Clear the board cells visually
  cells.forEach(cell => {
    cell.textContent = '';  // Remove X or O text
    cell.classList.remove('x', 'o');  // Remove X or O classes
  });
});

resetButton.addEventListener('click', () => {
  // Reset player stats, player names, and board
  playerXStats = { wins: 0, losses: 0, draws: 0, totalGames: 0 };
  playerOStats = { wins: 0, losses: 0, draws: 0, totalGames: 0 };

  // Reset input fields
  playerXInput.value = '';
  playerOInput.value = '';

  // Hide game section, show player input section again
  gameSection.classList.add('hidden');
  playerDataSection.classList.add('hidden');
  playerSection.classList.remove('hidden');

  // Clear the board and turn status
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });
  turnStatus.textContent = 'Enter player names to start!';
});

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (gameActive && !boardState[index]) {
      boardState[index] = currentPlayer;
      cell.textContent = currentPlayer === 'X' ? 'X' : 'O';
      cell.classList.add(currentPlayer.toLowerCase());

      if (checkWinner()) {
        gameActive = false;
        if (currentPlayer === 'X') {
          playerXStats.wins++;
          playerOStats.losses++;
        } else {
          playerOStats.wins++;
          playerXStats.losses++;
        }
        playerXStats.totalGames++;
        playerOStats.totalGames++;
        setTimeout(() => {
          alert(`${currentPlayer === 'X' ? playerXInput.value : playerOInput.value} wins!`);
          updatePlayerStats();
        }, 200);
      } else if (boardState.every(cell => cell !== null)) {
        gameActive = false;
        playerXStats.draws++;
        playerOStats.draws++;
        playerXStats.totalGames++;
        playerOStats.totalGames++;
        setTimeout(() => {
          alert('It\'s a draw!');
          updatePlayerStats();
        }, 200);
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        turnStatus.textContent = `${currentPlayer === 'X' ? playerXInput.value : playerOInput.value}'s turn (${currentPlayer})`;
      }
    }
  });
});

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Vertical
    [0, 4, 8], [2, 4, 6]              // Diagonal
  ];

  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
  });
}
