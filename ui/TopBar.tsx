import { Sparkles, Skull, Trophy, Flame } from 'lucide-react';
import { HeraldStats } from '../shared/types';

interface TopBarProps {
  stats: HeraldStats;
}

export default function TopBar({ stats }: TopBarProps) {
  return (
    <div className="h-12 bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-md border-x border-b border-amber-900/30 flex items-center justify-center gap-8 px-10 pointer-events-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-b-xl relative ring-1 ring-white/5">
      {/* Decorative Top Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="flex items-center gap-3 group cursor-help" title="Divinity: Your connection to the divine">
        <div className="relative">
          <Sparkles size={16} className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 bg-amber-400 blur-md opacity-20 animate-pulse" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-amber-500/60 uppercase tracking-widest">Divinity</span>
            <span className="text-[11px] font-black text-white ml-2">{Math.round(stats.divinity)}</span>
          </div>
          <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.4)]" style={{ width: `${stats.divinity}%` }} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 group cursor-help" title="Corruption: The taint of the mortal world">
        <Skull size={16} className="text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-purple-500/60 uppercase tracking-widest">Corruption</span>
            <span className="text-[11px] font-black text-white ml-2">{Math.round(stats.corruption)}</span>
          </div>
          <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-purple-800 to-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)]" style={{ width: `${stats.corruption}%` }} />
          </div>
        </div>
      </div>

      <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

      <div className="flex items-center gap-3 group cursor-help" title="Piety: Accumulated religious standing">
        <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
          <Flame size={16} className="text-sky-400" />
        </div>
        <div className="flex flex-col -gap-1">
          <span className="text-[11px] font-black text-white uppercase tracking-tighter italic">{Math.round(stats.piety)}</span>
          <span className="text-[8px] font-bold text-sky-400/60 tracking-wider">PIETY</span>
        </div>
      </div>

      <div className="flex items-center gap-3 group cursor-help" title="Renown: Your legendary status">
        <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
          <Trophy size={16} className="text-rose-400" />
        </div>
        <div className="flex flex-col -gap-1">
          <span className="text-[11px] font-black text-white uppercase tracking-tighter italic">{Math.round(stats.renown)}</span>
          <span className="text-[8px] font-bold text-rose-400/60 tracking-wider">RENOWN</span>
        </div>
      </div>

      {/* Decorative Bottom Corner Pins */}
      <div className="absolute -bottom-1 left-4 w-2 h-2 bg-amber-900/40 rounded-full border border-white/10 shadow-inner" />
      <div className="absolute -bottom-1 right-4 w-2 h-2 bg-amber-900/40 rounded-full border border-white/10 shadow-inner" />
    </div>
  );
}
