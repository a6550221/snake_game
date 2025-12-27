
import React from 'react';

interface ScoreboardProps {
  score: number;
  highScore: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, highScore }) => {
  const formatValue = (val: number) => val.toString().padStart(4, '0');

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-8 items-center justify-center p-6 bg-slate-900 border-2 border-cyan-500/30 rounded-xl neon-border">
      <div className="text-center">
        <div className="text-xs text-cyan-400 mb-1 tracking-widest uppercase opacity-70">Current Score</div>
        <div className="text-5xl digital-font text-cyan-400 bg-black px-4 py-2 rounded border border-cyan-500/20">
          {formatValue(score)}
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-xs text-pink-500 mb-1 tracking-widest uppercase opacity-70">Top Record</div>
        <div className="text-5xl digital-font text-pink-500 bg-black px-4 py-2 rounded border border-pink-500/20">
          {formatValue(highScore)}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
