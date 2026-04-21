import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Sparkles, Sword, Brain, Zap, ChevronRight, ChevronLeft, Crown } from 'lucide-react';
import { TRAITS, Trait } from '../ruler/state';

interface CharacterCreatorProps {
  onComplete: (data: { name: string, title: string, traits: string[] }) => void;
  onCancel: () => void;
}

export default function CharacterCreator({ onComplete, onCancel }: CharacterCreatorProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Heralda');
  const [title, setTitle] = useState('Herald of the Silver Flame');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const availableTraits = Object.values(TRAITS).filter(t => t.category !== 'divine' || t.id === 'chosen_one');
  const points = 3 - selectedTraits.length;

  const toggleTrait = (id: string) => {
    if (selectedTraits.includes(id)) {
      setSelectedTraits(prev => prev.filter(t => t !== id));
    } else if (points > 0) {
      setSelectedTraits(prev => [...prev, id]);
    }
  };

  return (
    <div className="absolute inset-0 z-[110] bg-[#050508] flex items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-stone-900/90 border border-amber-900/40 shadow-2xl rounded-sm overflow-hidden flex flex-col h-[700px]"
      >
        {/* Header */}
        <div className="p-8 border-b border-amber-900/20 bg-stone-800/40 flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="gothic-font text-3xl font-black text-white uppercase tracking-widest italic">Manifest the Envoy</h2>
            <p className="text-[10px] text-amber-500 uppercase tracking-[0.4em] font-bold">Step {step} of 2: {step === 1 ? 'Identity' : 'Innate Qualities'}</p>
          </div>
          <div className="flex gap-2">
            {[1, 2].map(i => (
              <div key={i} className={`w-3 h-3 rounded-full border ${step === i ? 'bg-amber-500 border-amber-400' : 'bg-stone-800 border-stone-700'}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-8 max-w-lg mx-auto"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Name of the Herald</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/40 border border-amber-900/30 p-4 text-white gothic-font tracking-widest focus:border-amber-500 outline-none transition-colors"
                    placeholder="Enter Name..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Apostolic Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-black/40 border border-amber-900/30 p-4 text-white italic serif-font tracking-wider focus:border-amber-500 outline-none transition-colors"
                    placeholder="Enter Title..."
                  />
                </div>

                <div className="mt-8 p-6 bg-amber-500/5 border border-amber-500/10 rounded-sm">
                  <p className="text-[11px] text-amber-200/60 leading-relaxed italic text-center uppercase tracking-widest">
                    "Every soul sent from the heavens carries a name that shall echo through the ages. Choose wisely, for history is written by the victors."
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Select 3 Starting Qualities</h3>
                  <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Points Remaining: {points}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {availableTraits.map((trait) => (
                    <button
                      key={trait.id}
                      onClick={() => toggleTrait(trait.id)}
                      className={`p-4 border text-left transition-all relative overflow-hidden group ${
                        selectedTraits.includes(trait.id)
                        ? 'bg-amber-900/20 border-amber-500'
                        : 'bg-black/20 border-white/5 hover:border-amber-900/40'
                      }`}
                    >
                      <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{trait.name}</span>
                        <p className="text-[9px] text-white/40 leading-tight h-8 line-clamp-2">{trait.description}</p>
                        <div className="mt-2 flex gap-1">
                          {Object.entries(trait.statModifiers).map(([stat, val]) => (
                            <span key={stat} className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">
                              {stat.slice(0,3)}: {val! > 0 ? '+' : ''}{val}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedTraits.includes(trait.id) && (
                        <div className="absolute top-2 right-2">
                          <Crown size={12} className="text-amber-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-amber-900/20 bg-stone-900 flex justify-between items-center">
          <button
            onClick={step === 1 ? onCancel : () => setStep(1)}
            className="flex items-center gap-2 text-[10px] font-black text-stone-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            <ChevronLeft size={16} />
            {step === 1 ? 'Discard' : 'Back'}
          </button>

          <button
            disabled={step === 2 && points !== 0}
            onClick={() => {
              if (step === 1) setStep(2);
              else onComplete({ name, title, traits: selectedTraits });
            }}
            className={`flex items-center gap-2 px-8 py-3 border font-black text-[10px] uppercase tracking-[0.3em] transition-all ${
              step === 2 && points !== 0
              ? 'border-stone-800 text-stone-700 cursor-not-allowed'
              : 'border-amber-500/40 text-amber-500 hover:bg-amber-500/10'
            }`}
          >
            {step === 1 ? 'Next' : 'Commence Saga'}
            <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
