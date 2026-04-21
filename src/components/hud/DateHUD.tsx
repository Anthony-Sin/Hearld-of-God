import { Pause, Play, ChevronRight, Map as MapIcon } from 'lucide-react';

interface DateHUDProps {
  currentDate: Date;
  gameSpeed: number;
  onSpeedChange: (speed: number) => void;
  onMenuClick?: (menu: string) => void;
}

export default function DateHUD({ currentDate, gameSpeed, onSpeedChange, onMenuClick }: DateHUDProps) {
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) + ' AD';

  return (
    <div className="flex flex-col items-end gap-2 pointer-events-auto">
      <div className="flex items-center gap-1.5 p-1 bg-black/60 backdrop-blur-md border border-white/10 rounded shadow-2xl">
        <div className="px-2 py-1 flex items-center gap-2 border-r border-white/10">
           <span className="text-[10px] font-bold text-white tracking-wider min-w-[140px] text-right">{formattedDate}</span>
           <button 
             onClick={() => onSpeedChange(gameSpeed === 0 ? 1 : 0)}
             className="hover:scale-110 transition-transform"
           >
             {gameSpeed === 0 ? <Play size={10} className="text-emerald-500" /> : <Pause size={10} className="text-amber-500" />}
           </button>
        </div>
        
        {/* Speed Bars */}
        <div className="flex items-center gap-1 px-1">
           {[1, 2, 3, 4, 5].map((s) => (
             <button 
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`w-1.5 h-3 rounded-sm transition-colors ${gameSpeed >= s ? 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]' : 'bg-white/10'}`}
             />
           ))}
        </div>
        
        <div className="px-2 py-1 border-l border-white/10 flex items-center gap-2">
           <MapIcon size={12} className="text-white/40" />
           <ChevronRight size={12} className="text-white/40" />
        </div>
      </div>
    </div>
  );
}
