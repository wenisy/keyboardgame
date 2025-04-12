import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Keyboard from '../components/Keyboard';
import '../styles/Practice.css';

const Practice: React.FC = () => {
  // 练习文本库
  const practiceTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "Amazingly few discotheques provide jukeboxes.",
    "Sphinx of black quartz, judge my vow.",
    "The five boxing wizards jump quickly.",
    "Jackdaws love my big sphinx of quartz.",
    "The jay, pig, fox, zebra, and my wolves quack!",
    "Crazy Fredrick bought many very exquisite opal jewels.",
    "We promptly judged antique ivory buckles for the next prize."
  ];

  // 状态
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  // 我们会在代码中使用endTimeNow变量而不是endTime状态
  // const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [currentKey, setCurrentKey] = useState('');
  const [incorrectKey, setIncorrectKey] = useState('');
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
  const [level, setLevel] = useState(1);
  const [completed, setCompleted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化练习
  useEffect(() => {
    startNewText();
  }, [level]);

  // 开始新的练习文本
  const startNewText = () => {
    // 根据级别选择文本难度
    let textIndex = Math.min(level - 1, practiceTexts.length - 1);
    if (textIndex < 0) textIndex = 0;

    const newText = practiceTexts[textIndex];
    setCurrentText(newText);
    setUserInput('');
    setStartTime(null);
    // setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setCurrentKey('');
    setIncorrectKey('');
    setCompleted(false);

    // 设置高亮键（只高亮第一个字符）
    const firstChar = newText.charAt(0).toLowerCase();
    setHighlightedKeys([firstChar]);

    // 聚焦输入框
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 处理用户输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // 如果是第一次输入，记录开始时间
    if (!startTime && input.length === 1) {
      setStartTime(Date.now());
    }

    setUserInput(input);

    // 检查输入是否正确
    if (input.length > 0) {
      const lastChar = input.charAt(input.length - 1);
      const expectedChar = currentText.charAt(input.length - 1);

      if (lastChar === expectedChar) {
        setCurrentKey(lastChar);
        setIncorrectKey('');
      } else {
        setIncorrectKey(lastChar);
        setCurrentKey('');
        setErrors(errors + 1);
      }

      // 更新高亮键（当前应该输入的字符）
      if (input.length < currentText.length) {
        const nextChar = currentText.charAt(input.length).toLowerCase();
        setHighlightedKeys([nextChar]);
      } else {
        setHighlightedKeys([]);
      }
    } else {
      // 如果输入为空，高亮第一个字符
      setCurrentKey('');
      setIncorrectKey('');
      const firstChar = currentText.charAt(0).toLowerCase();
      setHighlightedKeys([firstChar]);
    }

    // 计算准确率
    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (i < currentText.length && input[i] === currentText[i]) {
        correctChars++;
      }
    }
    const newAccuracy = input.length > 0 ? Math.floor((correctChars / input.length) * 100) : 100;
    setAccuracy(newAccuracy);

    // 如果完成当前文本
    if (input === currentText) {
      const endTimeNow = Date.now();
      // setEndTime(endTimeNow);

      // 计算WPM (Words Per Minute)
      if (startTime) {
        const timeInMinutes = (endTimeNow - startTime) / 60000; // 转换为分钟
        const words = currentText.split(' ').length;
        const newWpm = Math.round(words / timeInMinutes);
        setWpm(newWpm);
      }

      setCompleted(true);
    }
  };

  // 进入下一级
  const handleNextLevel = () => {
    setLevel(level + 1);
  };

  // 重新开始当前级别
  const handleRestart = () => {
    startNewText();
  };

  // 渲染文本显示，高亮当前字符
  const renderTextDisplay = () => {
    return (
      <div className="text-display">
        {currentText.split('').map((char, index) => {
          let className = '';
          if (index < userInput.length) {
            className = userInput[index] === char ? 'correct-character' : 'incorrect-character';
          } else if (index === userInput.length) {
            className = 'current-character';
          }
          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="practice-container">
      <header className="practice-header">
        <h1 className="practice-title">打字练习 - 级别 {level}</h1>
      </header>

      <main className="practice-content">
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-label">WPM (每分钟字数)</div>
            <div className="stat-value">{wpm}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">准确率</div>
            <div className="stat-value">{accuracy}%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">错误数</div>
            <div className="stat-value">{errors}</div>
          </div>
        </div>

        <div className="typing-area">
          {renderTextDisplay()}

          <input
            ref={inputRef}
            type="text"
            className="input-field"
            value={userInput}
            onChange={handleInputChange}
            placeholder="开始输入上面的文本..."
            disabled={completed}
            autoFocus
          />

          <Keyboard
            highlightedKeys={highlightedKeys}
            pressedKey={currentKey}
            incorrectKey={incorrectKey}
            showFingers={true}
          />

          {completed && (
            <div className="completion-message">
              <h3>恭喜！你已完成本级别</h3>
              <p>WPM: {wpm} | 准确率: {accuracy}% | 错误数: {errors}</p>
            </div>
          )}

          <div className="controls">
            <Link to="/" className="control-button home-button">返回主页</Link>
            <button onClick={handleRestart} className="control-button restart-button">重新开始</button>
            {completed && (
              <button onClick={handleNextLevel} className="control-button next-button">下一级</button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Practice;
