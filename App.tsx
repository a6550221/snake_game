
import React, { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import Scoreboard from './components/Scoreboard';
import GreetingCardModal from './components/GreetingCardModal';
import RetroSynth from './components/RetroSynth';
import { GameStatus } from './types';

const App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('IDLE');
  const [showModal, setShowModal] = useState(false);
  const [lastGameScore, setLastGameScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('neon-snake-highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const handleGameOver = (finalScore: number) => {
    setLastGameScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('neon-snake-highscore', finalScore.toString());
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <header className="mb-12 text-center relative z-10">
        <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          <span className="text-cyan-400">NEON</span>
          <span className="text-pink-500">SNAKE</span>
        </h1>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-pink-500 to-transparent mt-2"></div>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center relative z-10">
        <Scoreboard score={score} highScore={highScore} />
        
        <SnakeGame 
          status={gameStatus}
          onStatusChange={setGameStatus}
          onGameOver={handleGameOver} 
          updateScore={setScore}
        />

        <div className="mt-12 flex flex-col items-center gap-6">
          {gameStatus === 'GAME_OVER' && (
            <button
              onClick={() => setShowModal(true)}
              className="group relative px-8 py-4 bg-transparent border-2 border-pink-500 text-pink-500 rounded-xl font-bold uppercase tracking-widest overflow-hidden transition-all hover:text-white"
            >
              <div className="absolute inset-0 bg-pink-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Generate Victory Card
              </span>
            </button>
          )}
          
          <div className="flex gap-4 opacity-50 text-[10px] text-slate-500 tracking-widest uppercase font-bold">
            <span>Synthwave Active</span>
            <span>•</span>
            <span>AI Neural Link Ready</span>
            <span>•</span>
            <span>v2.5-PRO</span>
          </div>
        </div>
      </main>

      <RetroSynth />

      {showModal && (
        <GreetingCardModal 
          score={lastGameScore} 
          onClose={() => setShowModal(false)} 
        />
      )}

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    </div>
  );
};

export default App;
