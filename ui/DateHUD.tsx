import { Play, Pause, FastForward, SkipForward } from 'lucide-react';
import { motion } from 'motion/react';

interface DateHUDProps {
  currentDate: Date; // Kept for prop compatibility if needed, but unused in display
  gameSpeed: number;
  onSpeedChange: (speed: number) => void;
  onMenuClick: (modal: any) => void;
}

export default function DateHUD({ gameSpeed, onSpeedChange }: DateHUDProps) {
  const speeds = [0, 1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col gap-2 items-end">
      {/* Game Speed Controls (CK3 Style) */}
      <div className="flex items-center gap-1 bg-stone-900/90 border border-amber-900/30 p-1 rounded-sm shadow-2xl backdrop-blur-sm pointer-events-auto">
        <button
          onClick={() => onSpeedChange(gameSpeed === 0 ? 1 : 0)}
          className={`p-2 transition-all rounded ${gameSpeed === 0 ? 'bg-amber-500 text-black' : 'text-stone-400 hover:text-amber-400'}`}
        >
          {gameSpeed === 0 ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
        </button>
        
        <div className="w-[1px] h-4 bg-amber-900/20 mx-1" />

        <div className="flex gap-0.5">
          {speeds.slice(1).map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`w-6 h-6 flex items-center justify-center text-[10px] font-black transition-all rounded ${
                gameSpeed === s ? 'bg-amber-900/40 text-amber-400 border border-amber-500/30' : 'text-stone-600 hover:text-stone-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="ml-2 px-2 py-1 bg-black/40 rounded flex items-center gap-2">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((step) => (
                    <div
                        key={step}
                        className={`w-1 h-3 rounded-full ${gameSpeed >= step ? 'bg-amber-500 shadow-[0_0_5px_#f59e0b]' : 'bg-stone-800'}`}
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
