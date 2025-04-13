import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Keyboard from '../components/Keyboard';
import NavBar from '../components/NavBar';
import AudioService from '../services/AudioService';
import '../styles/Tutorial.css';

const AdvancedTutorial: React.FC = () => {
  // 音频服务实例
  const audioService = AudioService.getInstance();

  const [currentLesson, setCurrentLesson] = useState(1);
  const [practiceText, setPracticeText] = useState('');
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [currentKey, setCurrentKey] = useState('');
  const [incorrectKey, setIncorrectKey] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 初始化音频服务
  useEffect(() => {
    // 加载打字机声音
    audioService.loadSound('keypress1', '/sounds/typewriter-key1.mp3');
    audioService.loadSound('keypress2', '/sounds/typewriter-key2.mp3');
    audioService.loadSound('keypress3', '/sounds/typewriter-key3.mp3');

    // 默认启用声音
    audioService.setEnabled(true);

    return () => {
      // 组件卸载时禁用声音
      audioService.setEnabled(false);
    };
  }, []);

  // 课程内容
  const lessons = [
    {
      title: "提高打字速度",
      content: "现在你已经掌握了基本的打字技巧，接下来我们将专注于提高你的打字速度。速度提升的关键是肌肉记忆和流畅的节奏感。",
      tips: [
        "保持稳定的节奏，不要忽快忽慢",
        "专注于准确性，速度会随着练习自然提高",
        "尝试预读文本，提前准备手指位置",
        "定期休息，避免疲劳"
      ],
      practiceText: "the five boxing wizards jump quickly the five boxing wizards jump quickly",
      highlightedKeys: ['t', 'h', 'e', 'f', 'i', 'v', 'b', 'o', 'x', 'n', 'g', 'w', 'z', 'a', 'r', 'd', 's', 'j', 'u', 'm', 'p', 'q', 'c', 'k', 'l', 'y']
    },
    {
      title: "数字和符号练习",
      content: "数字和符号在打字中也非常重要，尤其是在编程或数据输入工作中。这些键通常位于键盘的上方，需要手指离开主行。",
      tips: [
        "数字键使用与字母键相同的手指",
        "练习时注意手指的伸展和回位",
        "符号键通常需要使用Shift键配合",
        "尝试不看键盘完成输入"
      ],
      practiceText: "1234567890 !@#$%^&*() 1234567890 !@#$%^&*()",
      highlightedKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')']
    },
    {
      title: "编程常用符号",
      content: "对于程序员来说，熟练掌握编程中常用的符号是非常重要的。这些包括括号、引号、分号等。",
      tips: [
        "注意括号的配对",
        "引号和分号是编程中最常用的符号",
        "尝试记住这些符号的位置，不需要低头看键盘",
        "练习常见的代码片段可以提高编程效率"
      ],
      practiceText: "if (x > 0) { return true; } else { return false; }",
      highlightedKeys: ['i', 'f', '(', ')', '{', '}', 'r', 'e', 't', 'u', 'n', ';', 'l', 's']
    },
    {
      title: "快捷键组合",
      content: "掌握常用的快捷键组合可以大大提高工作效率。这些组合通常涉及Ctrl、Alt、Shift等修饰键。",
      tips: [
        "Ctrl+C (复制)、Ctrl+V (粘贴)、Ctrl+Z (撤销)是最基本的快捷键",
        "尝试使用Alt+Tab切换窗口",
        "Ctrl+S保存文件是一个好习惯",
        "不同的软件可能有不同的快捷键，尝试学习你常用软件的快捷键"
      ],
      practiceText: "Ctrl+C Ctrl+V Ctrl+Z Ctrl+S Alt+Tab Ctrl+A Ctrl+F",
      highlightedKeys: ['ctrl', 'c', 'v', 'z', 's', 'alt', 'tab', 'a', 'f']
    },
    {
      title: "长文本打字练习",
      content: "最后，我们将进行一段较长文本的打字练习，这将综合测试你的打字技能。记住保持放松，专注于准确性而不是速度。",
      tips: [
        "保持良好的坐姿",
        "定期休息眼睛和手指",
        "尝试理解你正在打的内容，这有助于提高速度",
        "打字时保持呼吸均匀，不要屏住呼吸"
      ],
      practiceText: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
      highlightedKeys: []
    }
  ];

  // 切换声音开关
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    audioService.setEnabled(newState);
  };

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
        // 播放按键声音（正确按键）
        if (soundEnabled) {
          // 随机选择一种打字机声音
          const randomNum = Math.random();
          let soundId;
          if (randomNum < 0.33) {
            soundId = 'keypress1';
          } else if (randomNum < 0.66) {
            soundId = 'keypress2';
          } else {
            soundId = 'keypress3';
          }
          audioService.playSound(soundId);
        }
      } else {
        setIncorrectKey(lastChar);
        setCurrentKey('');
        // 错误按键也可以播放声音
        if (soundEnabled) {
          // 随机选择一种打字机声音
          const randomNum = Math.random();
          let soundId;
          if (randomNum < 0.33) {
            soundId = 'keypress1';
          } else if (randomNum < 0.66) {
            soundId = 'keypress2';
          } else {
            soundId = 'keypress3';
          }
          audioService.playSound(soundId);
        }
      }

      // 更新高亮键，指向下一个需要输入的字符
      const nextChar = practiceText.charAt(input.length);
      if (nextChar) {
        setHighlightedKeys([nextChar]);
      } else {
        setHighlightedKeys([]);
      }
    } else {
      setCurrentKey('');
      setIncorrectKey('');
      // 如果输入为空，高亮第一个字符
      setHighlightedKeys([practiceText.charAt(0)]);
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
      <NavBar />
      <header className="tutorial-header">
        <div className="tutorial-header-content">
          <h1 className="tutorial-title">进阶教程</h1>
          <p className="tutorial-subtitle">第 {currentLesson} 课 - {lesson.title}</p>
        </div>
        <div className="tutorial-options">
          <button
            onClick={toggleSound}
            className={`option-button ${soundEnabled ? 'option-enabled' : 'option-disabled'}`}
            title={soundEnabled ? "关闭声音" : "开启声音"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
        </div>
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

export default AdvancedTutorial;
