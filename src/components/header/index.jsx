import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./style.css";

export function Header() {
  const navigate = useNavigate();
  return (
    <div className="header">
      <div className="name ">
        <button className="buttonHeader" onClick={() => navigate("/")}>
          SudokuIA
        </button>
        <button className="buttonHeader" onClick={() => navigate("/chess")}>
          XadrezIA
        </button>
      </div>
      <div className="logo">
        <FaGithub fontSize={35} />
      </div>
    </div>
  );
}

export default Header;
