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

    // 确定键的类名
    const isHighlighted = highlightedKeys.includes(key.toLowerCase());
    const isPressed = pressedKey.toLowerCase() === key.toLowerCase();
    const isIncorrect = incorrectKey.toLowerCase() === key.toLowerCase();
    const isSpecial = Object.keys(specialKeyClasses).includes(key);

    const keyClassName = `key ${isSpecial ? specialKeyClasses[key] : ''} ${isHighlighted ? 'key-highlighted' : ''} ${isPressed ? 'key-pressed' : ''} ${isIncorrect ? 'key-incorrect' : ''}`;

    // 确定手指指示器
    const fingerIndicator = showFingers && isHighlighted ? (
      <div className="finger-indicator"></div>
    ) : null;

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

    // 确定当前活跃的手指
    let activeFinger = '';
    if (pressedKey) {
      activeFinger = fingerMap[pressedKey.toLowerCase()] || '';
    }

    return (
      <div className="hand-diagram">
        <div className="left-hand hand">
          <div className={`finger finger-pinky ${activeFinger === 'left-pinky' ? 'finger-active' : ''}`} style={{ top: '20px', left: '20px' }}></div>
          <div className={`finger finger-ring ${activeFinger === 'left-ring' ? 'finger-active' : ''}`} style={{ top: '10px', left: '50px' }}></div>
          <div className={`finger finger-middle ${activeFinger === 'left-middle' ? 'finger-active' : ''}`} style={{ top: '5px', left: '80px' }}></div>
          <div className={`finger finger-index ${activeFinger === 'left-index' ? 'finger-active' : ''}`} style={{ top: '10px', left: '110px' }}></div>
          <div className={`finger finger-thumb ${activeFinger === 'left-thumb' ? 'finger-active' : ''}`} style={{ top: '60px', left: '140px' }}></div>
        </div>
        <div className="right-hand hand">
          <div className={`finger finger-thumb ${activeFinger === 'right-thumb' ? 'finger-active' : ''}`} style={{ top: '60px', right: '140px' }}></div>
          <div className={`finger finger-index ${activeFinger === 'right-index' ? 'finger-active' : ''}`} style={{ top: '10px', right: '110px' }}></div>
          <div className={`finger finger-middle ${activeFinger === 'right-middle' ? 'finger-active' : ''}`} style={{ top: '5px', right: '80px' }}></div>
          <div className={`finger finger-ring ${activeFinger === 'right-ring' ? 'finger-active' : ''}`} style={{ top: '10px', right: '50px' }}></div>
          <div className={`finger finger-pinky ${activeFinger === 'right-pinky' ? 'finger-active' : ''}`} style={{ top: '20px', right: '20px' }}></div>
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
