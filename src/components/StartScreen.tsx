import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      zIndex: 1000,
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>警察抓小偷</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>打字游戏</h2>
      
      <div style={{ 
        maxWidth: '600px', 
        textAlign: 'center', 
        marginBottom: '2rem',
        lineHeight: '1.6'
      }}>
        <p>游戏规则：</p>
        <p>屏幕上会出现单词，正确输入每个字母，警察就会向前移动追赶小偷。</p>
        <p>输入错误的字母没有反应。</p>
        <p>完成单词后会获得额外分数，并出现新的单词。</p>
        <p>在时间结束前抓住小偷即为胜利！</p>
      </div>
      
      <button 
        onClick={onStart}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.5rem',
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
        开始游戏
      </button>
    </div>
  );
};

export default StartScreen;
