
import React, { useState } from 'react';
import { generateVictoryCard, checkApiKey, openApiKeySelector } from '../services/geminiService';
import { ImageGenConfig } from '../types';
import { ASPECT_RATIOS, IMAGE_SIZES } from '../constants';

interface GreetingCardModalProps {
  score: number;
  onClose: () => void;
}

const GreetingCardModal: React.FC<GreetingCardModalProps> = ({ score, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<ImageGenConfig>({
    aspectRatio: '1:1',
    imageSize: '1K'
  });

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const hasKey = await checkApiKey();
      if (!hasKey) {
        // Trigger the environment-provided API key selection dialog.
        // As per guidelines, we assume the selection was successful and proceed.
        await openApiKeySelector();
      }
      
      const result = await generateVictoryCard(score, config);
      if (result) {
        setImageUrl(result);
      } else {
        setError("Failed to generate image.");
      }
    } catch (err: any) {
      // If the request fails with 404/not found, it often means an invalid project/key combo.
      if (err.message?.includes("Requested entity was not found")) {
        setError("Invalid API key or project. Please ensure you select a paid GCP project.");
        await openApiKeySelector();
      } else {
        setError("An error occurred during generation. Please check your connection and API key.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `snake-victory-${score}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border-2 border-pink-500/50 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-pink-500/20 flex justify-between items-center">
          <h2 className="text-2xl font-bold neon-text-pink">Generate Victory Card</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-8">
          {!imageUrl ? (
            <div className="space-y-6">
              <p className="text-slate-300 text-center text-lg">
                Celebrate your score of <span className="text-cyan-400 font-bold">{score}</span> with an AI-generated retro synthwave greeting card!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-cyan-400 uppercase tracking-widest mb-2">Aspect Ratio</label>
                  <select 
                    value={config.aspectRatio}
                    onChange={(e) => setConfig(prev => ({ ...prev, aspectRatio: e.target.value as any }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {ASPECT_RATIOS.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-cyan-400 uppercase tracking-widest mb-2">Image Quality</label>
                  <select 
                    value={config.imageSize}
                    onChange={(e) => setConfig(prev => ({ ...prev, imageSize: e.target.value as any }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {IMAGE_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                  </select>
                </div>
              </div>

              {error && <p className="text-red-500 text-center bg-red-500/10 p-3 rounded border border-red-500/20">{error}</p>}

              <button
                disabled={loading}
                onClick={handleGenerate}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  loading 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg hover:shadow-pink-500/40'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Synthesizing Card...
                  </span>
                ) : 'Generate Now'}
              </button>
              
              <div className="text-[10px] text-slate-500 text-center mt-4 space-y-1">
                <p>* Requires a paid Google Cloud Project API Key with Gemini 3 Pro access.</p>
                <p>
                  Ensure billing is enabled: 
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline ml-1">
                    ai.google.dev/gemini-api/docs/billing
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative group overflow-hidden rounded-xl border-4 border-cyan-500/30">
                <img src={imageUrl} alt="Victory Card" className="w-full h-auto" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-lg font-bold tracking-widest">PREVIEW</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-cyan-500/40"
                >
                  Download Image
                </button>
                <button
                  onClick={() => setImageUrl(null)}
                  className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GreetingCardModal;