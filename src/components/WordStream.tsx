import React, { useEffect, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface WordStreamProps {
  onCorrectKey: () => void;
  onWordComplete: () => void;
  level: number;
  gameOver: boolean;
}

interface Word {
  id: number;
  text: string;
  position: [number, number, number];
  currentIndex: number;
  speed: number;
  active: boolean;
}

// 扩展单词库
const wordsByLevel = {
  easy: [
    'run', 'jump', 'stop', 'go', 'fast', 'slow', 'move', 'turn', 'look', 'see',
    'help', 'catch', 'find', 'hide', 'seek', 'play', 'walk', 'talk', 'hear', 'call'
  ],
  medium: [
    'police', 'thief', 'chase', 'escape', 'arrest', 'crime', 'patrol', 'guard', 'watch',
    'search', 'follow', 'pursue', 'capture', 'detect', 'suspect', 'officer', 'criminal',
    'justice', 'pursuit', 'fugitive', 'outrun', 'evade', 'sprint', 'hurdle', 'dodge'
  ],
  hard: [
    'investigation', 'apprehension', 'surveillance', 'prosecution', 'detective',
    'enforcement', 'incarceration', 'interrogation', 'jurisdiction', 'undercover',
    'fingerprint', 'evidence', 'handcuffs', 'conviction', 'sentence', 'felony',
    'misdemeanor', 'accomplice', 'alibi', 'witness', 'testimony', 'courtroom'
  ]
};

const WordStream: React.FC<WordStreamProps> = ({
  onCorrectKey,
  onWordComplete,
  level,
  gameOver
}) => {
  const [words, setWords] = useState<Word[]>([]);
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [nextWordId, setNextWordId] = useState<number>(1);
  const [lastSpawnTime, setLastSpawnTime] = useState<number>(0);

  // 根据级别选择单词难度
  const getWordsByLevel = () => {
    if (level <= 3) return wordsByLevel.easy;
    if (level <= 7) return [...wordsByLevel.easy, ...wordsByLevel.medium];
    return [...wordsByLevel.medium, ...wordsByLevel.hard];
  };

  // 生成新单词
  const spawnNewWord = () => {
    const availableWords = getWordsByLevel();
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const wordText = availableWords[randomIndex];

    // 随机位置和速度
    const xPos = Math.random() * 16 - 8; // 在 -8 到 8 之间的随机位置
    const yPos = 3 + Math.random() * 2; // 在 3 到 5 之间的随机高度
    const baseSpeed = 0.005 + (level * 0.001); // 基础速度随级别增加
    const randomSpeed = baseSpeed + (Math.random() * 0.005); // 添加一些随机性

    const newWord: Word = {
      id: nextWordId,
      text: wordText,
      position: [xPos, yPos, 0],
      currentIndex: 0,
      speed: randomSpeed,
      active: activeWordId === null // 如果没有活动单词，则这个新单词为活动单词
    };

    setWords(prev => [...prev, newWord]);
    setNextWordId(prev => prev + 1);

    // 如果没有活动单词，将这个设为活动单词
    if (activeWordId === null) {
      setActiveWordId(newWord.id);
    }
  };

  // 处理单词移动和消失
  useFrame((state) => {
    if (gameOver) return;

    // 生成新单词的逻辑
    const currentTime = state.clock.getElapsedTime();
    const spawnInterval = Math.max(5 - (level * 0.4), 1.5); // 随级别增加，生成间隔缩短

    if (currentTime - lastSpawnTime > spawnInterval) {
      spawnNewWord();
      setLastSpawnTime(currentTime);
    }

    // 更新单词位置
    setWords(prevWords => {
      return prevWords.map(word => {
        // 单词向下移动
        const newYPos = word.position[1] - word.speed;

        // 如果单词移出屏幕底部，移除它
        if (newYPos < -2) {
          // 如果这是活动单词，需要选择新的活动单词
          if (word.id === activeWordId) {
            const remainingWords = prevWords.filter(w => w.id !== word.id && w.position[1] > -2);
            if (remainingWords.length > 0) {
              // 选择最高的单词作为新的活动单词
              const highestWord = remainingWords.reduce((prev, current) =>
                prev.position[1] > current.position[1] ? prev : current
              );
              setActiveWordId(highestWord.id);
            } else {
              setActiveWordId(null);
            }
          }
          return { ...word, position: [word.position[0], newYPos, word.position[2]] as [number, number, number] };
        }

        return { ...word, position: [word.position[0], newYPos, word.position[2]] as [number, number, number] };
      }).filter(word => word.position[1] > -3); // 完全移出屏幕的单词被移除
    });
  });

  // 处理键盘输入
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameOver || activeWordId === null) return;

      // 只处理字母键 (a-z)
      if (/^[a-z]$/i.test(event.key)) {
        const activeWord = words.find(word => word.id === activeWordId);
        if (!activeWord) return;

        const expectedChar = activeWord.text[activeWord.currentIndex]?.toLowerCase();
        const pressedChar = event.key.toLowerCase();

        if (pressedChar === expectedChar) {
          // 正确按键
          setWords(prevWords => {
            return prevWords.map(word => {
              if (word.id === activeWordId) {
                const newIndex = word.currentIndex + 1;

                // 检查单词是否完成
                if (newIndex === word.text.length) {
                  onWordComplete();

                  // 选择新的活动单词
                  const remainingWords = prevWords.filter(w => w.id !== word.id);
                  if (remainingWords.length > 0) {
                    // 选择最高的单词作为新的活动单词
                    const highestWord = remainingWords.reduce((prev, current) =>
                      prev.position[1] > current.position[1] ? prev : current
                    );
                    setActiveWordId(highestWord.id);
                  } else {
                    setActiveWordId(null);
                  }

                  // 移除完成的单词
                  return { ...word, currentIndex: newIndex, active: false };
                }

                return { ...word, currentIndex: newIndex };
              } else if (word.id !== activeWordId && !word.active) {
                // 更新其他单词的活动状态
                return { ...word, active: word.id === activeWordId };
              }
              return word;
            });
          });

          onCorrectKey();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [words, activeWordId, onCorrectKey, onWordComplete, gameOver]);

  // 渲染单词
  const renderWords = () => {
    return words.map(word => (
      <group key={word.id} position={word.position}>
        {Array.from(word.text).map((char, index) => {
          // 根据状态设置颜色
          let color = 'white';
          if (word.id === activeWordId) {
            color = index < word.currentIndex ? 'green' : '#FFD700'; // 活动单词使用金色
          } else {
            color = index < word.currentIndex ? 'green' : 'white';
          }

          return (
            <Text
              key={index}
              position={[index * 0.6 - (word.text.length * 0.3), 0, 0]}
              fontSize={0.5}
              color={color}

            >
              {char}
            </Text>
          );
        })}
      </group>
    ));
  };

  return (
    <group>
      {renderWords()}
    </group>
  );
};

export default WordStream;