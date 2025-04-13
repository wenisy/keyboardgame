import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Keyboard from '../components/Keyboard';
import CustomTextInput from '../components/CustomTextInput';
import LevelSelector from '../components/LevelSelector';
import NavBar from '../components/NavBar';
import AudioService from '../services/AudioService';
import '../styles/Practice.css';

const Practice: React.FC = () => {
  // 音频服务实例
  const audioService = AudioService.getInstance();

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

  // 中文练习文本
  const chinesePracticeTexts = [
    "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。",
    "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
    "锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。",
    "白日依山尽，黄河入海流。欲穷千里目，更上一层楼。",
    "小时不识月，呼作白玉盘。又疑瑶台镜，飞在青云端。"
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

  // 新增状态
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundType, setSoundType] = useState<'keypress1' | 'keypress2' | 'keypress3'>('keypress3'); // 默认使用key3音效
  const [showSoundSelector, setShowSoundSelector] = useState(false);
  const [showCustomTextInput, setShowCustomTextInput] = useState(false);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [customTexts, setCustomTexts] = useState<string[]>([]);
  const [isCustomText, setIsCustomText] = useState(false);
  const [textLanguage, setTextLanguage] = useState<'english' | 'chinese'>('english');

  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化练习
  useEffect(() => {
    startNewText();
  }, [level]);

  // 开始新的练习文本
  const startNewText = useCallback(() => {
    // 如果是自定义文本模式
    if (isCustomText && customTexts.length > 0) {
      // 使用自定义文本中的第一个
      const newText = customTexts[0];
      setCurrentText(newText);
    } else {
      // 根据级别和语言选择文本难度
      const texts = textLanguage === 'english' ? practiceTexts : chinesePracticeTexts;
      let textIndex = Math.min(level - 1, texts.length - 1);
      if (textIndex < 0) textIndex = 0;

      const newText = texts[textIndex];
      setCurrentText(newText);
    }

    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setCurrentKey('');
    setIncorrectKey('');
    setCompleted(false);

    // 设置高亮键（只高亮第一个字符）
    const firstChar = currentText.charAt(0).toLowerCase();
    setHighlightedKeys([firstChar]);

    // 聚焦输入框
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [level, isCustomText, customTexts, textLanguage, currentText]);

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
        // 播放按键声音（正确按键）
        if (soundEnabled) {
          // 使用用户选择的声音
          audioService.playSound(soundType);
        }
      } else {
        setIncorrectKey(lastChar);
        setCurrentKey('');
        setErrors(errors + 1);
        // 错误按键也播放声音
        if (soundEnabled) {
          // 使用用户选择的声音
          audioService.playSound(soundType);
        }
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

  // 切换声音开关
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    audioService.setEnabled(newState);
  };

  // 打开声音选择器
  const toggleSoundSelector = () => {
    setShowSoundSelector(!showSoundSelector);
  };

  // 选择声音类型
  const selectSoundType = (type: 'keypress1' | 'keypress2' | 'keypress3') => {
    setSoundType(type);
    setShowSoundSelector(false);
  };

  // 打开自定义文本输入框
  const openCustomTextInput = () => {
    setShowCustomTextInput(true);
  };

  // 关闭自定义文本输入框
  const closeCustomTextInput = () => {
    setShowCustomTextInput(false);
  };

  // 处理自定义文本提交
  const handleCustomTextSubmit = (text: string) => {
    setCustomTexts([text]);
    setIsCustomText(true);
    setShowCustomTextInput(false);

    // 使用新的自定义文本开始练习
    setCurrentText(text);
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setCurrentKey('');
    setIncorrectKey('');
    setCompleted(false);

    // 设置高亮键（只高亮第一个字符）
    const firstChar = text.charAt(0).toLowerCase();
    setHighlightedKeys([firstChar]);

    // 聚焦输入框
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // 打开关卡选择器
  const openLevelSelector = () => {
    setShowLevelSelector(true);
  };

  // 关闭关卡选择器
  const closeLevelSelector = () => {
    setShowLevelSelector(false);
  };

  // 选择关卡
  const handleLevelSelect = (selectedLevel: number) => {
    setLevel(selectedLevel);
    setShowLevelSelector(false);
    setIsCustomText(false); // 切换回预设文本
  };

  // 切换语言
  const toggleLanguage = () => {
    setTextLanguage(textLanguage === 'english' ? 'chinese' : 'english');
    setIsCustomText(false); // 切换回预设文本
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
      <NavBar />
      <header className="practice-header">
        <div className="practice-header-content">
          <h1 className="practice-title">
            打字练习 {isCustomText ? '- 自定义文本' : `- 级别 ${level}`}
          </h1>
        </div>
        <div className="practice-options">
          <button
            onClick={toggleSound}
            className={`option-button ${soundEnabled ? 'option-enabled' : 'option-disabled'}`}
            title={soundEnabled ? "关闭声音" : "开启声音"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
          <div className="sound-selector-container">
            <button
              onClick={toggleSoundSelector}
              className="option-button"
              title="选择声音类型"
            >
              🎵
            </button>
            {showSoundSelector && (
              <div className="sound-selector-dropdown">
                <button
                  onClick={() => selectSoundType('keypress1')}
                  className={`sound-option ${soundType === 'keypress1' ? 'selected' : ''}`}
                >
                  声音 1
                </button>
                <button
                  onClick={() => selectSoundType('keypress2')}
                  className={`sound-option ${soundType === 'keypress2' ? 'selected' : ''}`}
                >
                  声音 2
                </button>
                <button
                  onClick={() => selectSoundType('keypress3')}
                  className={`sound-option ${soundType === 'keypress3' ? 'selected' : ''}`}
                >
                  声音 3
                </button>
              </div>
            )}
          </div>
          <button
            onClick={toggleLanguage}
            className="option-button"
            title={`切换到${textLanguage === 'english' ? '中文' : '英文'}`}
          >
            {textLanguage === 'english' ? "🇨🇳" : "🇬🇧"}
          </button>
          <button
            onClick={openCustomTextInput}
            className="option-button"
            title="自定义文本"
          >
            📝
          </button>
          <button
            onClick={openLevelSelector}
            className="option-button"
            title="选择关卡"
          >
            🎮
          </button>
        </div>
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
              <h3>恭喜！你已完成{isCustomText ? '自定义文本' : '本级别'}</h3>
              <p>WPM: {wpm} | 准确率: {accuracy}% | 错误数: {errors}</p>
            </div>
          )}

          <div className="controls">
            <Link to="/" className="control-button home-button">返回主页</Link>
            <button onClick={handleRestart} className="control-button restart-button">重新开始</button>
            {completed && !isCustomText && (
              <button onClick={handleNextLevel} className="control-button next-button">下一级</button>
            )}
          </div>
        </div>
      </main>

      {/* 自定义文本输入模态框 */}
      {showCustomTextInput && (
        <CustomTextInput
          onSubmit={handleCustomTextSubmit}
          onCancel={closeCustomTextInput}
        />
      )}

      {/* 关卡选择模态框 */}
      {showLevelSelector && (
        <LevelSelector
          currentLevel={level}
          maxLevel={Math.max(practiceTexts.length, chinesePracticeTexts.length)}
          onSelectLevel={handleLevelSelect}
          onClose={closeLevelSelector}
        />
      )}
    </div>
  );
};

export default Practice;
