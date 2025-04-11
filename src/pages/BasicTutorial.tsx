import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Keyboard from '../components/Keyboard';
import '../styles/Tutorial.css';

const BasicTutorial: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState(1);
  const [practiceText, setPracticeText] = useState('aaa sss ddd fff');
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>(['a', 's', 'd', 'f']);
  const [userInput, setUserInput] = useState('');
  const [currentKey, setCurrentKey] = useState('');
  const [incorrectKey, setIncorrectKey] = useState('');

  // 课程内容 - 帮助用户学习打字技能
  const lessons = [
    {
      title: "基本指法 - 键盘布局",
      content: "在开始学习打字之前，了解键盘布局和正确的手指位置非常重要。每个手指负责特定的键，这样可以提高打字速度和减少疲劳。",
      tips: [
        "每个键对应一个特定的手指 - 保持你的手指在主行（ASDF JKL;）上",
        "不要看键盘 - 通过感觉找到键位",
        "保持手腕稍微抬起，不要放在桌子上",
      ],
      practiceText: "aaa sss ddd fff jjj kkk lll ;;;",
      highlightedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';']
    },
    {
      title: "主行练习",
      content: "主行（home row）是指键盘中间一行的ASDF JKL;键。这些键是打字的基础，你的手指应该默认放在这些键上。",
      tips: [
        "左手小指负责A键",
        "左手无名指负责S键",
        "左手中指负责D键",
        "左手食指负责F键",
        "右手食指负责J键",
        "右手中指负责K键",
        "右手无名指负责L键",
        "右手小指负责;键"
      ],
      practiceText: "asdf jkl; asdf jkl; fjfj dkdk slsl a;a;",
      highlightedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';']
    },
    {
      title: "上行练习",
      content: "上行是指键盘上方的QWERTY UIOP键。练习这些键可以帮助你的手指更灵活地移动。",
      tips: [
        "从主行移动手指到上行，然后迅速返回",
        "保持其他手指在主行上",
        "尽量不要低头看键盘"
      ],
      practiceText: "qwer uiop qwer uiop fqfq juju dwd kik ses lol",
      highlightedKeys: ['q', 'w', 'e', 'r', 'u', 'i', 'o', 'p']
    },
    {
      title: "下行练习",
      content: "下行是指键盘下方的ZXCV BNM,./键。这些键通常使用频率较低，但同样重要。",
      tips: [
        "从主行移动手指到下行，然后迅速返回",
        "保持其他手指在主行上",
        "注意小指的伸展，不要过度用力"
      ],
      practiceText: "zxcv bnm, zxcv bnm, fzfz jmjm dxd kbk scsc l,l,",
      highlightedKeys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',']
    },
    {
      title: "组合练习",
      content: "现在我们将练习所有三行的键位，这将帮助你的手指在键盘上自由移动。",
      tips: [
        "保持放松，不要紧张",
        "专注于准确性，而不是速度",
        "如果感到疲劳，请休息一下"
      ],
      practiceText: "the quick brown fox jumps over the lazy dog",
      highlightedKeys: ['t', 'h', 'e', 'q', 'u', 'i', 'c', 'k', 'b', 'r', 'o', 'w', 'n', 'f', 'o', 'x']
    }
  ];

  // 处理用户输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);

    // 检查输入是否正确
    if (input.length > 0) {
      const lastChar = input.charAt(input.length - 1);
      const expectedChar = practiceText.charAt(input.length - 1);

      if (lastChar === expectedChar) {
        setCurrentKey(lastChar);
        setIncorrectKey('');
      } else {
        setIncorrectKey(lastChar);
        setCurrentKey('');
      }
    } else {
      setCurrentKey('');
      setIncorrectKey('');
    }

    // 如果完成当前练习文本，自动进入下一课
    if (input === practiceText && currentLesson < lessons.length) {
      setTimeout(() => {
        setCurrentLesson(currentLesson + 1);
        setUserInput('');
      }, 1000);
    }
  };

  // 当课程改变时更新练习文本和高亮键
  useEffect(() => {
    if (currentLesson <= lessons.length) {
      const lesson = lessons[currentLesson - 1];
      setPracticeText(lesson.practiceText);
      setHighlightedKeys(lesson.highlightedKeys);
      setUserInput('');
      setCurrentKey('');
      setIncorrectKey('');
    }
  }, [currentLesson]);

  // 获取当前课程
  const lesson = lessons[currentLesson - 1];

  return (
    <div className="tutorial-container">
      <header className="tutorial-header">
        <h1 className="tutorial-title">基础教程</h1>
        <p className="tutorial-subtitle">第 {currentLesson} 课 - {lesson.title}</p>
      </header>

      <main className="tutorial-content">
        <div className="tutorial-card">
          <h2 className="tutorial-section-title">{lesson.title}</h2>
          <p className="tutorial-text">{lesson.content}</p>

          <div className="tips-container">
            <h3 className="tips-title">小贴士:</h3>
            <ul className="tips-list">
              {lesson.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="practice-area">
            <h3 className="practice-title">练习文本:</h3>
            <div className="text-display">
              {practiceText.split('').map((char, index) => {
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
            <input
              type="text"
              className="input-field"
              value={userInput}
              onChange={handleInputChange}
              placeholder="在这里输入上面的文本..."
              autoFocus
            />
          </div>

          <Keyboard
            highlightedKeys={highlightedKeys}
            pressedKey={currentKey}
            incorrectKey={incorrectKey}
            showFingers={true}
          />

          <div className="navigation-buttons">
            <Link to="/" className="back-button">返回主页</Link>
            {currentLesson < lessons.length ? (
              <button
                className="next-button"
                onClick={() => setCurrentLesson(currentLesson + 1)}
              >
                下一课
              </button>
            ) : (
              <Link to="/practice" className="next-button">开始练习</Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BasicTutorial;
