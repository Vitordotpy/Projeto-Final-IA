import React, { Component } from "react";
import "./style.css";
export default class SudokuField extends Component {
  handleChange = (e) => {
    const value = "" ? null : parseInt(e.target.value);

    const key = {
      row: this.props.row,
      col: this.props.col,
    };

    this.props.onChange({ ...this.props.field, value, key });
  };
  render() {
    const { field, row, col, sudoku, isDuplicate } = this.props;

    return (
      <input
        className={`field ${isDuplicate ? "red" : null}`}
        disabled={sudoku[row][col] !== 0 ? true : false}
        value={field || ""}
        onChange={this.handleChange}
      />
    );
  }
}
