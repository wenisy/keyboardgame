import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import BasicTutorial from './pages/BasicTutorial';
import AdvancedTutorial from './pages/AdvancedTutorial';
import Practice from './pages/Practice';
import './styles/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user: string) => {
    setIsLoggedIn(true);
    setUsername(user);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home username={username} /> : <Login onLogin={handleLogin} />} />
          <Route path="/basic-tutorial" element={<BasicTutorial />} />
          <Route path="/advanced-tutorial" element={<AdvancedTutorial />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
