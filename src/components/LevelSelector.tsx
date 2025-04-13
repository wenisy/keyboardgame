import React from 'react';
import '../styles/LevelSelector.css';

interface LevelSelectorProps {
  currentLevel: number;
  maxLevel: number;
  onSelectLevel: (level: number) => void;
  onClose: () => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  maxLevel,
  onSelectLevel,
  onClose
}) => {
  // 生成关卡按钮
  const renderLevelButtons = () => {
    const buttons = [];
    for (let i = 1; i <= maxLevel; i++) {
      buttons.push(
        <button
          key={i}
          className={`level-button ${i === currentLevel ? 'current-level' : ''}`}
          onClick={() => onSelectLevel(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="level-selector-modal">
      <div className="level-selector-content">
        <h2>选择关卡</h2>
        <div className="level-buttons-container">
          {renderLevelButtons()}
        </div>
        <button className="close-button" onClick={onClose}>
          关闭
        </button>
      </div>
    </div>
  );
};

export default LevelSelector;
