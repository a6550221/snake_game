
import React, { useEffect, useRef, useState } from 'react';

const RetroSynth: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startMusic = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.1, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    // Bass line
    const playBass = (freq: number, time: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      g.gain.setValueAtTime(0.2, time);
      g.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.5);
    };

    // Synth Melody
    const playLead = (freq: number, time: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);
      g.gain.setValueAtTime(0.1, time);
      g.gain.exponentialRampToValueAtTime(0.01, time + 0.8);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(time);
      osc.stop(time + 1.0);
    };

    const notes = [110, 130.81, 146.83, 164.81]; // A2, C3, D3, E3
    const leadNotes = [440, 523.25, 587.33, 659.25];

    let step = 0;
    const interval = setInterval(() => {
      if (!audioCtxRef.current) return;
      const now = audioCtxRef.current.currentTime;
      playBass(notes[step % notes.length], now);
      if (step % 4 === 0) {
        playLead(leadNotes[(step / 2) % leadNotes.length], now);
      }
      step++;
    }, 400);

    (window as any)._synthInterval = interval;
    setIsPlaying(true);
  };

  const stopMusic = () => {
    if ((window as any)._synthInterval) {
      clearInterval((window as any)._synthInterval);
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current!.currentTime + 0.5);
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button 
        onClick={isPlaying ? stopMusic : startMusic}
        className={`px-4 py-2 rounded-full border-2 transition-all duration-300 flex items-center gap-2 ${
          isPlaying 
            ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' 
            : 'border-pink-500 text-pink-500 bg-pink-500/10'
        } hover:scale-105`}
      >
        {isPlaying ? (
          <span className="flex gap-1 items-center">
            <div className="w-1 h-4 bg-cyan-400 animate-pulse"></div>
            <div className="w-1 h-6 bg-cyan-400 animate-pulse delay-75"></div>
            <div className="w-1 h-3 bg-cyan-400 animate-pulse delay-150"></div>
            Stop Music
          </span>
        ) : (
          <span>▶ Play Synthwave</span>
        )}
      </button>
    </div>
  );
};

export default RetroSynth;
