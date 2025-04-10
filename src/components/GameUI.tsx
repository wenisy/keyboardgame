import React from 'react';

interface GameUIProps {
  score: number;
  level: number;
  timeLeft: number;
  gameOver: boolean;
  gameWon: boolean;
  onRestart: () => void;
}

const GameUI: React.FC<GameUIProps> = ({ 
  score, 
  level, 
  timeLeft, 
  gameOver, 
  gameWon, 
  onRestart 
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      padding: '20px',
      zIndex: 100,
      color: 'white',
      fontFamily: 'Arial, sans-serif',
    }}>
      {/* 顶部信息栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '10px 20px',
        borderRadius: '10px',
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span>分数:</span>
            <span style={{ color: '#FFD700' }}>{score}</span>
          </div>
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span>关卡:</span>
            <span style={{ color: '#4CAF50' }}>{level}</span>
          </div>
        </div>
        
        <div style={{ 
          fontSize: '1.2rem', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span>时间:</span>
          <span style={{ 
            color: timeLeft <= 10 ? '#FF6347' : 'white',
            animation: timeLeft <= 10 ? 'pulse 1s infinite' : 'none'
          }}>
            {timeLeft}秒
          </span>
        </div>
      </div>
      
      {/* 游戏结束提示 */}
      {gameOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center',
          zIndex: 1000,
        }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            color: gameWon ? '#4CAF50' : '#FF6347',
            marginBottom: '20px'
          }}>
            {gameWon ? '胜利！' : '游戏结束'}
          </h2>
          <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
            {gameWon ? '你成功抓住了小偷！' : '小偷逃跑了！'}
          </p>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            最终得分: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{score}</span>
          </p>
          <button 
            onClick={onRestart}
            style={{
              padding: '10px 20px',
              fontSize: '1.2rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            再来一次
          </button>
        </div>
      )}
      
      {/* 键盘提示 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '10px 20px',
        borderRadius: '10px',
        textAlign: 'center',
      }}>
        <p>输入屏幕上显示的单词中的字母</p>
      </div>
    </div>
  );
};

export default GameUI;
