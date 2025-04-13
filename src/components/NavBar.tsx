import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

interface NavBarProps {
  showHomeButton?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ showHomeButton = true }) => {
  return (
    <nav className="navbar">
      {showHomeButton && (
        <Link to="/" className="home-link">
          <span className="home-icon">🏠</span>
          <span className="home-text">返回主页</span>
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
