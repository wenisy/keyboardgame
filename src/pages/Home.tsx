import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/Home.css';

interface HomeProps {
  username: string;
}

const Home: React.FC<HomeProps> = ({ username }) => {
  return (
    <div className="home-container">
      <NavBar showHomeButton={false} />
      <header className="home-header">
        <h1 className="home-title">打字大师</h1>
        <p className="home-welcome">欢迎回来, {username}!</p>
      </header>

      <main className="menu-container">
        <div className="menu-card">
          <div className="menu-icon">⌨️</div>
          <div className="menu-content">
            <h2 className="menu-title">基础教程</h2>
            <p className="menu-description">
              学习正确的手指位置和基本打字技巧。适合初学者和想要巩固基础的用户。
            </p>
            <Link to="/basic-tutorial" className="menu-button">开始学习</Link>
          </div>
        </div>

        <div className="menu-card">
          <div className="menu-icon">🚀</div>
          <div className="menu-content">
            <h2 className="menu-title">进阶教程</h2>
            <p className="menu-description">
              提高你的打字速度和准确性，学习高级技巧和快捷键。适合有一定基础的用户。
            </p>
            <Link to="/advanced-tutorial" className="menu-button">开始学习</Link>
          </div>
        </div>

        <div className="menu-card">
          <div className="menu-icon">🎯</div>
          <div className="menu-content">
            <h2 className="menu-title">打字练习</h2>
            <p className="menu-description">
              通过各种练习提高你的打字速度和准确性。包含多种难度级别和文本类型。
            </p>
            <Link to="/practice" className="menu-button">开始练习</Link>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <p>© 2025 打字大师 | 由 Paul.X 开发</p>
      </footer>
    </div>
  );
};

export default Home;
