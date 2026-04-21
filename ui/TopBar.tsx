import { Coins, Star, Hash, Trophy, Users } from 'lucide-react';
import { GameResources } from '@shared/types';

interface TopBarProps {
  resources: GameResources;
  selectedProvinceName?: string;
}

export default function TopBar({ resources }: TopBarProps) {
  return (
    <div className="h-10 bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center gap-6 px-6 pointer-events-auto shadow-2xl rounded-sm">
      <div className="flex items-center gap-2 group cursor-help" title="Gold">
        <Coins size={14} className="text-amber-400" />
        <span className="text-[11px] font-bold text-white/90">{resources.gold}</span>
        <span className="text-[9px] text-emerald-400 opacity-60">+2.4</span>
      </div>
      <div className="flex items-center gap-2 group cursor-help" title="Prestige">
        <Star size={14} className="text-sky-400" />
        <span className="text-[11px] font-bold text-white/90">{resources.prestige}</span>
        <span className="text-[9px] text-emerald-400 opacity-60">+4.1</span>
      </div>
      <div className="flex items-center gap-2 group cursor-help" title="Piety">
        <Hash size={14} className="text-white/60" />
        <span className="text-[11px] font-bold text-white/90">{resources.piety}</span>
        <span className="text-[9px] text-emerald-400 opacity-60">+1.2</span>
      </div>
      <div className="flex items-center gap-2 group cursor-help" title="Renown">
        <Trophy size={14} className="text-rose-400" />
        <span className="text-[11px] font-bold text-white/90">{resources.renown}</span>
        <span className="text-[9px] text-emerald-400 opacity-60">+0.8</span>
      </div>
      <div className="h-4 w-[1px] bg-white/10 mx-2" />
      <div className="flex items-center gap-2 group cursor-help" title="Army">
        <Users size={14} className="text-white/40" />
        <span className="text-[11px] font-bold text-white/90">1.2K</span>
      </div>

    </div>
  );
}
