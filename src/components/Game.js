import React, { useState } from 'react';
import GameBoard from './GameBoard';
import './Game.css';

const BOARD_SIZE = 6;
const EMPTY_BOARD = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));

const Game = () => {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [round, setRound] = useState(1);
  const [gameStatus, setGameStatus] = useState('playing');
  const [moveCount, setMoveCount] = useState(0);
  const [roundResults, setRoundResults] = useState({ player1: null, player2: null });

  const isOrderPlayer = (player, roundOverride = null) => {
    const r = roundOverride !== null ? roundOverride : round;
    return (r === 1 && player === 1) || (r === 2 && player === 2);
  };

  const checkLine = (board, startRow, startCol, rowDelta, colDelta, length) => {
    const symbol = board[startRow][startCol];
    if (!symbol) return false;

    for (let i = 1; i < length; i++) {
      const row = startRow + i * rowDelta;
      const col = startCol + i * colDelta;
      if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE || board[row][col] !== symbol) {
        return false;
      }
    }
    return true;
  };

  const checkStraight4 = (board) => {
    let count = 0;
    const directions = [
      [0, 1],  // horizontal
      [1, 0],  // vertical
      [1, 1],  // diagonal down-right
      [1, -1], // diagonal down-left
    ];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        for (const [rowDelta, colDelta] of directions) {
          if (checkLine(board, row, col, rowDelta, colDelta, 4)) {
            count++;
          }
        }
      }
    }
    return count;
  };

  const checkWin = (board) => {
    const directions = [
      [0, 1],  // horizontal
      [1, 0],  // vertical
      [1, 1],  // diagonal down-right
      [1, -1], // diagonal down-left
    ];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        for (const [rowDelta, colDelta] of directions) {
          if (checkLine(board, row, col, rowDelta, colDelta, 5)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const handleCellClick = (row, col) => {
    if (board[row][col] !== null || gameStatus !== 'playing') return;

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = currentPlayer === 1 ? 'X' : 'O';
    setBoard(newBoard);
    setMoveCount(prev => prev + 1);

    const achieved5 = checkWin(newBoard);
    const straight4Count = checkStraight4(newBoard);
    const isOrder = isOrderPlayer(currentPlayer);

    if (achieved5) {
      if (isOrder) {
        setRoundResults(prev => ({
          ...prev,
          [currentPlayer === 1 ? 'player1' : 'player2']: {
            achieved5: true,
            moves: moveCount + 1,
            straight4s: straight4Count
          }
        }));
        setGameStatus('roundEnd');
      }
    } else if (moveCount + 1 === BOARD_SIZE * BOARD_SIZE) {
      // Board is full, record for whoever is current player
      setRoundResults(prev => ({
        ...prev,
        [currentPlayer === 1 ? 'player1' : 'player2']: {
          achieved5: false,
          moves: Infinity,
          straight4s: straight4Count
        }
      }));
      setGameStatus('roundEnd');
    }

    setCurrentPlayer(prev => prev === 1 ? 2 : 1);
  };

  const startNewRound = () => {
    // If round 1 is ending and Order result is missing, record it as failed
    if (round === 1 && !roundResults.player1) {
      setRoundResults(prev => ({
        ...prev,
        player1: {
          achieved5: false,
          moves: Infinity,
          straight4s: checkStraight4(board)
        }
      }));
      setRound(2);
      setBoard(EMPTY_BOARD);
      setMoveCount(0);
      setGameStatus('playing');
      setCurrentPlayer(1);
      return;
    }
    // If round 2 is ending and Order result is missing, record it as failed
    if (round === 2 && !roundResults.player2) {
      setRoundResults(prev => ({
        ...prev,
        player2: {
          achieved5: false,
          moves: Infinity,
          straight4s: checkStraight4(board)
        }
      }));
      // Do not return, so determineWinner will run after this
    }
    if (round === 1) {
      setRound(2);
      setBoard(EMPTY_BOARD);
      setMoveCount(0);
      setGameStatus('playing');
      setCurrentPlayer(1);
    } else {
      determineWinner();
    }
  };

  const determineWinner = () => {
    const { player1, player2 } = roundResults;
    if (!player1 || !player2) return;

    // Determine who was Order in each round
    // Round 1: Player 1 is Order, Player 2 is Chaos
    // Round 2: Player 2 is Order, Player 1 is Chaos
    const firstOrder = player1;
    const secondOrder = player2;

    // Case 1: First round Order achieved 5-in-a-row
    if (firstOrder.achieved5) {
      if (secondOrder.achieved5) {
        // Both Orders achieved 5-in-a-row, compare moves
        if (secondOrder.moves < firstOrder.moves) {
          setGameStatus('player2Wins');
        } else if (secondOrder.moves > firstOrder.moves) {
          setGameStatus('player1Wins');
        } else {
          // Moves tied, compare straight 4s
          if (secondOrder.straight4s > firstOrder.straight4s) {
            setGameStatus('player2Wins');
          } else if (secondOrder.straight4s < firstOrder.straight4s) {
            setGameStatus('player1Wins');
          } else {
            setGameStatus('draw');
          }
        }
      } else {
        // Second Order did not achieve 5-in-a-row, first Order wins
        setGameStatus('player1Wins');
      }
    } else {
      // Case 2: First round Order did NOT achieve 5-in-a-row
      if (secondOrder.achieved5) {
        setGameStatus('player2Wins');
      } else {
        // Neither Order achieved 5-in-a-row, compare straight 4s
        if (secondOrder.straight4s > firstOrder.straight4s) {
          setGameStatus('player2Wins');
        } else if (secondOrder.straight4s < firstOrder.straight4s) {
          setGameStatus('player1Wins');
        } else {
          setGameStatus('draw');
        }
      }
    }
  };

  const resetGame = () => {
    setBoard(EMPTY_BOARD);
    setCurrentPlayer(1);
    setRound(1);
    setGameStatus('playing');
    setMoveCount(0);
    setRoundResults({ player1: null, player2: null });
  };

  return (
    <div className="game">
      <div className="game-info">
        <h2>Round {round}</h2>
        <p>Current Player: {currentPlayer}</p>
        <p>Role: {isOrderPlayer(currentPlayer) ? 'Order' : 'Chaos'}</p>
        <p>Moves: {moveCount}</p>
      </div>
      
      <GameBoard
        board={board}
        onCellClick={handleCellClick}
        currentPlayer={currentPlayer}
        isOrderPlayer={isOrderPlayer(currentPlayer)}
      />

      {gameStatus === 'roundEnd' && (
        <div className="round-end">
          <h3>Round {round} Complete!</h3>
          <button onClick={startNewRound}>
            {round === 1 ? 'Start Round 2' : 'See Final Results'}
          </button>
        </div>
      )}

      {gameStatus !== 'playing' && gameStatus !== 'roundEnd' && (
        <div className="game-end">
          <h2>
            {gameStatus === 'player1Wins' ? 'Player 1 Wins!' :
             gameStatus === 'player2Wins' ? 'Player 2 Wins!' :
             'Game is a Draw!'}
          </h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Game; 