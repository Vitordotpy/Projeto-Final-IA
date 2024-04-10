import React, { Component } from "react";
import { isDuplicate } from "../../utils/isDuplicate";
import "./style.css";
import SudokuField from "./sudokuField";
export default class SudokuBoard extends Component {
  render() {
    const { sudoku, onChange } = this.props;

    return (
      <div>
        {sudoku.sudoku.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((field, colIndex) => (
              <SudokuField
                field={field}
                key={`${rowIndex}-${colIndex}`}
                sudoku={sudoku.sudokuInitial}
                row={rowIndex}
                isDuplicate={isDuplicate(
                  field,
                  rowIndex,
                  colIndex,
                  sudoku.sudoku
                )}
                col={colIndex}
                onChange={onChange}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}
