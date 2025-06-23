import React from 'react';
import './GameBoard.css';

const GameBoard = ({ board, onCellClick, currentPlayer, isOrderPlayer }) => {
  const handleCellClick = (row, col) => {
    if (board[row][col] === null) {
      onCellClick(row, col);
    }
  };

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`board-cell ${cell ? `cell-${cell.toLowerCase()}` : ''}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard; 