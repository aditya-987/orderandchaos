# Order and Chaos

A web-based implementation of the strategic board game **Order and Chaos** built with React.

## About
Order and Chaos is a two-player strategy game played on a 6x6 board. This project brings the game to your browser with a clean, interactive UI.

## Features
- Play the classic Order and Chaos game in your browser
- 6x6 interactive game board
- Two-player mode (local)
- Automatic win/draw detection
- Tracks rounds, moves, and patterns (like straight 4s)
- Responsive and modern UI

## Game Rules
- The game is played in two rounds. Each player takes turns being "Order" and "Chaos".
- **Order** aims to create a line of 5 consecutive Xs or Os (horizontally, vertically, or diagonally).
- **Chaos** tries to prevent Order from achieving this.
- Players alternate placing either an X or an O on any empty cell.
- At the end of each round, the result is recorded:
  - If Order achieves 5-in-a-row, the number of moves and straight 4s are tracked.
  - If the board fills with no 5-in-a-row, straight 4s are compared.
- After both rounds, the player who performed better as Order (faster 5-in-a-row, or more straight 4s if tied) wins. If still tied, the game is a draw.

## Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/aditya-987/orderandchaos
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Click on any empty cell to place your symbol (X or O).
- The UI will indicate the current player and their role (Order or Chaos).
- After each round, follow the prompts to proceed or restart.
