
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, INITIAL_SPEED, MIN_SPEED } from '../constants';
import { playEatSound, playCrashSound, playGameOverSound } from '../services/audioService';

interface SnakeGameProps {
  onGameOver: (score: number) => void;
  status: GameStatus;
  onStatusChange: (status: GameStatus) => void;
  updateScore: (score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onGameOver, status, onStatusChange, updateScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    updateScore(0);
  }, [generateFood, updateScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        playCrashSound();
        setTimeout(playGameOverSound, 150);
        onStatusChange('GAME_OVER');
        onGameOver(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        playEatSound();
        setScore(s => {
          const ns = s + 10;
          updateScore(ns);
          return ns;
        });
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(MIN_SPEED, prev - 2));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, onGameOver, onStatusChange, score, updateScore]);

  useEffect(() => {
    if (status !== 'PLAYING') return;
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [status, speed, moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Draw Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food.x * size + size/2, food.y * size + size/2, size/2.5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Snake
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#00cccc';
      const margin = index === 0 ? 1 : 2;
      ctx.fillRect(
        segment.x * size + margin, 
        segment.y * size + margin, 
        size - margin*2, 
        size - margin*2
      );
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="relative bg-slate-900 rounded-lg border-2 border-slate-800"
      />
      {status === 'IDLE' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm">
          <h2 className="text-4xl font-bold neon-text-cyan mb-6 tracking-widest">NEON SNAKE</h2>
          <button
            onClick={() => {
              resetGame();
              onStatusChange('PLAYING');
            }}
            className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold text-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            START MISSION
          </button>
          <div className="mt-8 text-slate-400 text-sm animate-bounce flex items-center gap-2">
            <span>Use Arrow Keys or WASD to control</span>
          </div>
        </div>
      )}
      {status === 'GAME_OVER' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg backdrop-blur-md border border-red-500/50">
          <h2 className="text-5xl font-bold text-red-500 mb-2 drop-shadow-lg uppercase tracking-tighter">System Crash</h2>
          <p className="text-slate-400 mb-8 font-mono">Mission Failed. Final Data: {score}</p>
          <div className="flex flex-col gap-4 w-64">
            <button
              onClick={() => {
                resetGame();
                onStatusChange('PLAYING');
              }}
              className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white rounded font-bold transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]"
            >
              RETRY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
