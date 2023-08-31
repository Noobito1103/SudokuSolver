import './App.css';
import SudokuGame from './components/sudokuGame';

function App() {
  return (
    <center>
      <div className='container'>
        
          <h1>Sudoku Solver</h1>
          <SudokuGame />
      </div>
    </center>
  );
}

export default App;
