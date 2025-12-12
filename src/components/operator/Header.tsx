import type { Operator } from '../../types/mission';
import './Header.css';

interface HeaderProps {
  operator: Operator;
  onMenuClick: () => void;
}

const Header = ({ operator, onMenuClick }: HeaderProps) => {
  return (
    <header className="operator-header">
      <div className="header-left">
        <h1>Lift Board</h1>
        <div className="operator-info">
          <span className="operator-name">Operatore: {operator.name}</span>
          <span className="operator-shift">Turno: {operator.shift}</span>
        </div>
      </div>
      <button className="menu-button" onClick={onMenuClick} aria-label="Menu">
        <span>☰</span>
      </button>
    </header>
  );
};

export default Header;
