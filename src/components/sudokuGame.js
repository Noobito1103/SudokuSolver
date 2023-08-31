import '../css/grid.css';
import { useState } from 'react';

export default function SudokuGame() {
  const initialSudokuGrid = Array(9).fill().map(() => Array(9).fill(''));
  const [sudokuGrid, setSudokuGrid] = useState(initialSudokuGrid);
  const [disableButton, setDisableButton] = useState(false);
  return(
    <>
      <div className='sudoku-board'>
        <RenderSudokuBoard 
          sudokuGrid={sudokuGrid} 
          setSudokuGrid={setSudokuGrid}
        />
      </div>
      
      <SolveButton 
        sudokuGrid={sudokuGrid} 
        setSudokuGrid={setSudokuGrid}
        disableButton={disableButton}
        setDisableButton={setDisableButton}
        />
      <ResetButton 
        initialSudokuGrid={initialSudokuGrid} 
        setSudokuGrid={setSudokuGrid}
        setDisableButton={setDisableButton}
      />
      
    </>
  )
}

function RenderSudokuBoard({ sudokuGrid, setSudokuGrid }){
  // useState(Array(9).fill().map(() => Array(9).fill('')));
  const handleInputChange = (value, row, col) => {
      // Create a copy of the current Sudoku grid
      const newGrid = [...sudokuGrid];
  
      // Limit input to accept one digit from 1-9
      if (/^[1-9]*$/.test(value)) {
        // Replace the value in the copied Sudoku grid
        newGrid[row][col] = value === '' ? '' : parseInt(value);
        setSudokuGrid(newGrid);
      }
  };
  return(
    <>
      <table>
        <tbody>
          {sudokuGrid.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              className='row'
            >
              {row.map((value, colIndex) => (
                <td key={colIndex}>
                  <input
                    className={`cell row-${rowIndex} col-${colIndex} ${value !== '' ? 'solved' : ''}`}
                    type='text'
                    maxLength='1'
                    value={value}
                    onChange={(e) => {
                      handleInputChange(e.target.value, rowIndex, colIndex)
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function SolveButton({ sudokuGrid, setSudokuGrid, disableButton, setDisableButton }){
  const solveSudoku = async(board) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Check if board is solvable
    const isSolvable = () => {

      // Check duplicates in rows
      for (let rowIndex = 0; rowIndex < board.length; rowIndex++){
        const checkNum = new Set();
        for (let colIndex = 0; colIndex < board.length; colIndex++){
          const cellNum = board[rowIndex][colIndex];
          if (cellNum !== '' && checkNum.has(cellNum)){
            return false;
          }
          if (cellNum !== ''){
            checkNum.add(cellNum);
          }
        }
      }

      // Check duplicates in columns
      for (let colIndex = 0; colIndex < board.length; colIndex++){
        const checkNum = new Set();
        for (let rowIndex = 0; rowIndex < board.length; rowIndex++){
          const cellNum = board[rowIndex][colIndex];
          if (cellNum !== '' && checkNum.has(cellNum)){
            return false;
          }
          if (cellNum !== ''){
            checkNum.add(cellNum);
          }
        }
      }

      // Check duplicates in 3x3 grid
      for (let gridRow = 0; gridRow < 3; gridRow++) {
        for (let gridCol = 0; gridCol < 3; gridCol++) {
          const checkNum = new Set();
          for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            for (let colIndex = 0; colIndex < 3; colIndex++) {
              const cellNum = board[gridRow * 3 + rowIndex][gridCol * 3 + colIndex];
              if (cellNum !== '' && checkNum.has(cellNum)) {
                return false;
              }
              if (cellNum !== ''){
                checkNum.add(cellNum);
              }
            }
          }
        }
      }
      return true; // Board is solvable
    }

    const checkEmptyCell = () => {
      for (let rowIndex = 0; rowIndex < board.length; rowIndex++){
        for (let colIndex = 0; colIndex < board.length; colIndex++){
            if (board[rowIndex][colIndex] === ''){
              return{ rowIndex, colIndex };
            }
          }
        }
      return false; // No more empty cells
    }

    const isSolutionValid = (row, col, num) => {
      // Check duplicate numbers in row
      for (let colIndex = 0; colIndex < board.length; colIndex++){
          if (board[row][colIndex] === num){
              return false;
          } 
      };
  
      // Check duplicate numbers in column
      for (let rowIndex = 0; rowIndex < board.length; rowIndex++){
          if (board[rowIndex][col] === num){
              return false;
          } 
      }
  
      // Check for duplicates in every inner 3x3 grid
      let innerGridSize = Math.floor(Math.sqrt(board.length));
      let gridStartRow = row - row % innerGridSize;
      let gridStartCol = col - col % innerGridSize;
  
      for (let r = gridStartRow; r < gridStartRow + innerGridSize; r++){
          for (let c = gridStartCol; c < gridStartCol + innerGridSize; c++){
              if (board[r][c] === num){
                  return false;
              }
          }
      }
      return true;
    }
  
    const solve = async() => {
      const emptyCells = checkEmptyCell();
      if (!emptyCells){
        return true; // Puzzle is solved
      }

      else{
        const row = emptyCells.rowIndex;
        const col = emptyCells.colIndex;
        for (let num = 1; num <= 9; num++){
          if (isSolutionValid(row, col, num)){
            board[row][col] = num;
            setSudokuGrid([...board]);
            await delay(8);

            if (await solve()){
                return true;
            }
            else{
                board[row][col] = '';
            }
          }
        }
      }
      return false;
    }

    if (isSolvable()){
      setDisableButton(true); // Disable solve button
      return await solve();
    }
    else{
      return false;
    }
  }

  const handleSolveButton = async() => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    if (await solveSudoku(sudokuGrid)){
      await delay(250); // Delay for better visualization
      alert('Solved!');
    }
    else{
      alert('No solution!');
    }
  }

  return(
      <button 
        className={`solve-btn ${disableButton ? 'disabled' : ''}`}
        onClick={() => {
          handleSolveButton();
        }}
        disabled={disableButton}
      >
        Solve Sudoku
      </button>
  )
}

function ResetButton({ initialSudokuGrid, setSudokuGrid, setDisableButton }){
  const resetSudoku = () => {
    setSudokuGrid(initialSudokuGrid)
  }
  return(
    <button 
      className='reset-btn'
      onClick = {() => {
        resetSudoku();
        setDisableButton(false);
      }}
      >
      Reset Board
    </button>
  )
}