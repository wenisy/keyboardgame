import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import '../styles/Login.css';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="login-container">
      <NavBar showHomeButton={false} />
      <div className="login-card">
        <div className="login-header">
          <img
            src="/keyboard-logo.png"
            alt="Typing Master Logo"
            className="login-logo"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/100x100?text=TM';
            }}
          />
          <h1 className="login-title">Typing Master</h1>
          <p className="login-subtitle">
            {isCreatingAccount
              ? "创建新账号开始你的打字之旅"
              : "提高你的打字技能，成为键盘大师"}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">用户名:</label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">密码:</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isCreatingAccount ? (
            <>
              <button type="submit" className="login-btn">创建账号</button>
              <button
                type="button"
                className="create-account-btn"
                onClick={() => setIsCreatingAccount(false)}
              >
                返回登录
              </button>
            </>
          ) : (
            <>
              <button type="submit" className="login-btn">登录</button>
              <button
                type="button"
                className="create-account-btn"
                onClick={() => setIsCreatingAccount(true)}
              >
                创建新账号
              </button>
            </>
          )}

          <p className="support-text">支持我们的项目</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
