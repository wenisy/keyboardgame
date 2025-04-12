import React from 'react';
import '../styles/Keyboard.css';

interface KeyboardProps {
  highlightedKeys: string[];
  pressedKey?: string;
  incorrectKey?: string;
  showFingers?: boolean;
}

const Keyboard: React.FC<KeyboardProps> = ({
  highlightedKeys = [],
  pressedKey = '',
  incorrectKey = '',
  showFingers = true
}) => {
  // 键盘布局
  const keyboardLayout = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
  ];

  // 手指与键的映射关系
  const fingerMap: Record<string, string> = {
    '`': 'left-pinky', '1': 'left-pinky', '2': 'left-ring', '3': 'left-middle', '4': 'left-index',
    '5': 'left-index', '6': 'right-index', '7': 'right-index', '8': 'right-middle', '9': 'right-ring',
    '0': 'right-pinky', '-': 'right-pinky', '=': 'right-pinky', 'Backspace': 'right-pinky',

    'Tab': 'left-pinky', 'q': 'left-pinky', 'w': 'left-ring', 'e': 'left-middle', 'r': 'left-index',
    't': 'left-index', 'y': 'right-index', 'u': 'right-index', 'i': 'right-middle', 'o': 'right-ring',
    'p': 'right-pinky', '[': 'right-pinky', ']': 'right-pinky', '\\': 'right-pinky',

    'Caps': 'left-pinky', 'a': 'left-pinky', 's': 'left-ring', 'd': 'left-middle', 'f': 'left-index',
    'g': 'left-index', 'h': 'right-index', 'j': 'right-index', 'k': 'right-middle', 'l': 'right-ring',
    ';': 'right-pinky', '\'': 'right-pinky', 'Enter': 'right-pinky',

    'Shift': 'left-pinky', 'z': 'left-pinky', 'x': 'left-ring', 'c': 'left-middle', 'v': 'left-index',
    'b': 'left-index', 'n': 'right-index', 'm': 'right-index', ',': 'right-middle', '.': 'right-ring',
    '/': 'right-pinky',

    'Ctrl': 'left-pinky', 'Alt': 'left-thumb', 'Space': 'thumb', 'right-Alt': 'right-thumb', 'right-Ctrl': 'right-pinky'
  };

  // 特殊键的宽度类
  const specialKeyClasses: Record<string, string> = {
    'Backspace': 'key-backspace',
    'Tab': 'key-tab',
    'Caps': 'key-caps',
    'Enter': 'key-enter',
    'Shift': 'key-shift',
    'Ctrl': 'key-ctrl',
    'Alt': 'key-alt',
    'Space': 'key-space'
  };

  // 渲染单个键
  const renderKey = (key: string, index: number, rowIndex: number) => {
    // 处理右侧的Shift, Alt, Ctrl
    // 注意：这里我们不使用displayKey变量，直接使用key

    // 确定当前需要输入的字母（只高亮一个键）
    const currentKey = highlightedKeys.length > 0 ? highlightedKeys[0].toLowerCase() : '';

    // 确定键的类名
    const isCurrentKey = key.toLowerCase() === currentKey;
    const isPressed = pressedKey.toLowerCase() === key.toLowerCase();
    const isIncorrect = incorrectKey.toLowerCase() === key.toLowerCase();
    const isSpecial = Object.keys(specialKeyClasses).includes(key);

    const keyClassName = `key ${isSpecial ? specialKeyClasses[key] : ''} ${isCurrentKey ? 'key-highlighted' : ''} ${isPressed ? 'key-pressed' : ''} ${isIncorrect ? 'key-incorrect' : ''}`;

    // 获取当前键应该使用的手指
    const fingerType = fingerMap[key.toLowerCase()] || '';

    // 手指类型的中文名称
    const fingerNames: Record<string, string> = {
      'left-pinky': '左小指',
      'left-ring': '左无名指',
      'left-middle': '左中指',
      'left-index': '左食指',
      'left-thumb': '左拇指',
      'right-pinky': '右小指',
      'right-ring': '右无名指',
      'right-middle': '右中指',
      'right-index': '右食指',
      'right-thumb': '右拇指',
      'thumb': '拇指'
    };

    // 手指指示器
    const fingerIndicator = showFingers && isCurrentKey && !isPressed ? (
      <div className="finger-indicator finger-indicator-next">
        <div className="finger-dot"></div>
        <div className="finger-name">{fingerNames[fingerType]}</div>
      </div>
    ) : (showFingers && isPressed ? (
      <div className="finger-indicator finger-indicator-active">
        <div className="finger-dot"></div>
      </div>
    ) : null);

    return (
      <div key={`${rowIndex}-${index}`} className={keyClassName}>
        {key === 'Space' ? '' : key}
        {fingerIndicator}
      </div>
    );
  };

  // 渲染键盘行
  const renderRow = (row: string[], rowIndex: number) => {
    return (
      <div key={rowIndex} className="keyboard-row">
        {row.map((key, index) => renderKey(key, index, rowIndex))}
      </div>
    );
  };

  // 渲染手指指示图
  const renderHandDiagram = () => {
    if (!showFingers) return null;

    // 确定当前需要输入的字母（只高亮一个键）
    const currentKey = highlightedKeys.length > 0 ? highlightedKeys[0].toLowerCase() : '';

    // 确定当前活跃的手指
    let activeFinger = '';
    let isPressed = false;

    // 如果有按下的键，显示绿色的手指
    if (pressedKey) {
      activeFinger = fingerMap[pressedKey.toLowerCase()] || '';
      isPressed = true;
    }
    // 否则，如果有高亮的键，显示橙色闪烁的手指提示
    else if (currentKey) {
      activeFinger = fingerMap[currentKey] || '';
    }

    // 手指类型的中文名称
    const fingerNames: Record<string, string> = {
      'left-pinky': '左小指',
      'left-ring': '左无名指',
      'left-middle': '左中指',
      'left-index': '左食指',
      'left-thumb': '左拇指',
      'right-pinky': '右小指',
      'right-ring': '右无名指',
      'right-middle': '右中指',
      'right-index': '右食指',
      'right-thumb': '右拇指',
      'thumb': '拇指'
    };

    // 渲染单个手指
    const renderFinger = (fingerType: string, position: React.CSSProperties) => {
      const isActive = activeFinger === fingerType;
      const fingerClass = isActive
        ? (isPressed ? 'finger-active' : 'finger-next')
        : '';

      return (
        <div
          className={`finger finger-${fingerType.split('-')[1]} ${fingerClass}`}
          style={position}
        >
          {isActive && !isPressed && (
            <div className="finger-tooltip">{fingerNames[fingerType]}</div>
          )}
        </div>
      );
    };

    return (
      <div className="hand-diagram">
        <div className="left-hand hand">
          {renderFinger('left-pinky', { top: '20px', left: '20px' })}
          {renderFinger('left-ring', { top: '10px', left: '50px' })}
          {renderFinger('left-middle', { top: '5px', left: '80px' })}
          {renderFinger('left-index', { top: '10px', left: '110px' })}
          {renderFinger('left-thumb', { top: '60px', left: '140px' })}
        </div>
        <div className="right-hand hand">
          {renderFinger('right-thumb', { top: '60px', right: '140px' })}
          {renderFinger('right-index', { top: '10px', right: '110px' })}
          {renderFinger('right-middle', { top: '5px', right: '80px' })}
          {renderFinger('right-ring', { top: '10px', right: '50px' })}
          {renderFinger('right-pinky', { top: '20px', right: '20px' })}
        </div>
      </div>
    );
  };

  return (
    <div className="keyboard-container">
      <div className="keyboard">
        {keyboardLayout.map(renderRow)}
      </div>
      {renderHandDiagram()}
    </div>
  );
};

export default Keyboard;
