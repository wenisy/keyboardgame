import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Cloud, Stars } from '@react-three/drei';
import Character from './Character';
import WordStream from './WordStream';
import StartScreen from './StartScreen';
import GameUI from './GameUI';

const GameCanvas: React.FC = () => {
  // Game state
  const [score, setScore] = useState<number>(0);
  const [gameLevel, setGameLevel] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds game time
  const [isPoliceMoving, setIsPoliceMoving] = useState<boolean>(false);

  // Character positions
  const [policePosition, setPolicePosition] = useState<[number, number, number]>([-5, 0, 0]);
  const [thiefPosition, setThiefPosition] = useState<[number, number, number]>([5, 0, 0]);

  // Target positions for smooth movement
  const [policeTarget, setPoliceTarget] = useState<[number, number, number]>([-5, 0, 0]);
  const [thiefTarget, setThiefTarget] = useState<[number, number, number]>([5, 0, 0]);

  // Distance at which police catches thief
  const catchDistance = 1;

  // Start the game
  const startGame = () => {
    resetGame();
    setGameStarted(true);
  };

  // Handler for correct key presses
  const handleCorrectKey = () => {
    setScore(prev => prev + 10);
    setIsPoliceMoving(true);

    // Move police closer to thief
    setPoliceTarget(prev => [prev[0] + 0.2, prev[1], prev[2]]);

    // Reset movement animation after a short delay
    setTimeout(() => setIsPoliceMoving(false), 300);

    // Check if police caught the thief
    if (policeTarget[0] + catchDistance >= thiefTarget[0]) {
      setGameWon(true);
      setGameOver(true);
    }
  };

  // Handler for completed words
  const handleWordComplete = () => {
    setScore(prev => prev + 50);
    setGameLevel(prev => Math.min(prev + 1, 10));

    // Move thief slightly away if not caught yet
    if (!gameOver && !gameWon) {
      // Make it harder to catch the thief at higher levels
      const escapeDistance = Math.max(0.1, 0.5 - (gameLevel * 0.03));
      setThiefTarget(prev => [Math.min(prev[0] + escapeDistance, 8), prev[1], prev[2]]);
    }
  };

  // Reset game
  const resetGame = () => {
    setScore(0);
    setGameLevel(1);
    setGameOver(false);
    setGameWon(false);
    setTimeLeft(60);
    setPolicePosition([-5, 0, 0]);
    setThiefPosition([5, 0, 0]);
    setPoliceTarget([-5, 0, 0]);
    setThiefTarget([5, 0, 0]);
    setIsPoliceMoving(false);
  };

  // Effect to handle game timer
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // Effect to handle key press to restart game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver && e.key === 'r') {
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // City Scene Component
  const CityScene = () => {
    return (
      <>
        {/* Sky and environment */}
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0.6} azimuth={0.25} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Clouds */}
        <Cloud position={[-10, 15, -5]} speed={0.2} opacity={0.7} />
        <Cloud position={[10, 10, -10]} speed={0.1} opacity={0.5} />

        {/* Road or path */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[20, 5]} />
          <meshStandardMaterial color="#1F2937" />
        </mesh>

        {/* Road markings */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
          <planeGeometry args={[0.5, 5]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>

        {/* Simple buildings */}
        {Array.from({ length: 10 }).map((_, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          const distance = 4 + (i * 0.5);
          const height = 1 + Math.random() * 3;
          const width = 0.8 + Math.random() * 1.2;
          const depth = 0.8 + Math.random() * 1.2;

          return (
            <mesh key={i} position={[side * distance, height / 2 - 0.5, -2.5]}>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial color={`hsl(${210 + i * 5}, ${30 + i * 3}%, ${40 + i * 2}%)`} />
            </mesh>
          );
        })}
      </>
    );
  };

  return (
    <>
      {!gameStarted && <StartScreen onStart={startGame} />}

      {gameStarted && (
        <GameUI
          score={score}
          level={gameLevel}
          timeLeft={timeLeft}
          gameOver={gameOver}
          gameWon={gameWon}
          onRestart={resetGame}
        />
      )}

      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <CityScene />

          {/* Police Character */}
          <Character
            characterType="police"
            position={policePosition}
            targetPosition={policeTarget}
            isMoving={isPoliceMoving}
            isCaught={false}
          />

          {/* Thief Character */}
          <Character
            characterType="thief"
            position={thiefPosition}
            targetPosition={thiefTarget}
            isMoving={false}
            isCaught={gameWon}
          />

          {/* Word Stream */}
          {gameStarted && !gameOver && (
            <WordStream
              onCorrectKey={handleCorrectKey}
              onWordComplete={handleWordComplete}
              level={gameLevel}
              gameOver={gameOver}
            />
          )}

          {/* Game controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </>
  );
};

export default GameCanvas;