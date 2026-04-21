import {
  Shield, Zap, Sword, Flame, BookOpen, Scale, Sparkles, Star,
  Crown, Heart, Coins, Trophy, Hash
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import VoxelCharacter from '@ruler/VoxelCharacter';
import { BaronyData } from '@map/types';
import { motion, AnimatePresence } from 'motion/react';
import { HeraldStats, RulerTrait, DivineBalance, HeraldInfo } from '../shared/types';

interface PortraitHUDProps {
  selectedProvince: BaronyData | null;
  heraldInfo: HeraldInfo;
  heraldStats: HeraldStats;
  traits: RulerTrait[];
  divineBalance: DivineBalance;
  onAction?: (action: any) => void;
}

export default function PortraitHUD({
  selectedProvince,
  heraldInfo,
  heraldStats,
  traits,
  divineBalance,
  onAction
}: PortraitHUDProps) {

  const stats = [
    { label: 'Authority', value: heraldStats.authority, icon: Shield, color: 'text-sky-400' },
    { label: 'Zeal', value: heraldStats.zeal, icon: Flame, color: 'text-amber-500' },
    { label: 'Cunning', value: heraldStats.cunning, icon: Zap, color: 'text-purple-400' },
    { label: 'Valor', value: heraldStats.valor, icon: Sword, color: 'text-rose-500' },
    { label: 'Wisdom', value: heraldStats.wisdom, icon: BookOpen, color: 'text-emerald-400' },
  ];

  const getIconComponent = (name: string) => {
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon size={14} /> : <Star size={14} />;
  };

  return (
    <div className="fixed bottom-8 left-8 flex flex-col items-start gap-4 pointer-events-none z-40">
      <div className="relative pointer-events-auto">
        {/* Herald Name & Title */}
        <div className="absolute -top-14 left-4 flex flex-col">
          <h3 className="gothic-font text-xl font-black text-amber-400 uppercase tracking-wide drop-shadow-lg leading-none">
            {heraldInfo.name}
          </h3>
          <span className="serif-font text-xs text-stone-400 italic">
            {heraldInfo.title}
          </span>
          <div className="h-[2px] w-32 bg-gradient-to-r from-amber-500/50 to-transparent mt-1" />
        </div>

        {/* Stat Badge Arc */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex items-center"
            >
              <div className={`w-8 h-8 rounded-full bg-stone-900 border border-amber-900/30 flex items-center justify-center ${stat.color} shadow-lg cursor-help transition-all group-hover:scale-110 group-hover:border-amber-500/50`}>
                <stat.icon size={14} />
              </div>
              <div className="absolute left-10 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 border border-amber-900/30 px-2 py-1 rounded shadow-2xl whitespace-nowrap z-50">
                <span className="text-[10px] font-bold text-stone-200 uppercase tracking-widest">{stat.label}: </span>
                <span className={`text-[10px] font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Voxel Portrait Frame */}
        <div className="w-48 h-48 bg-stone-900 border-4 border-amber-900/40 rounded-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative group ml-6 ring-2 ring-amber-500/10">
          <VoxelCharacter provinceData={selectedProvince} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Action Buttons Arc (CK3 Style) */}
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-2 px-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             <button onClick={() => onAction?.('character')} className="w-8 h-8 rounded-full bg-stone-800 border border-amber-900/40 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-black transition-all shadow-lg">
                <Crown size={14} />
             </button>
             <button onClick={() => onAction?.('military')} className="w-8 h-8 rounded-full bg-stone-800 border border-amber-900/40 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg">
                <Sword size={14} />
             </button>
             <button onClick={() => onAction?.('decisions')} className="w-8 h-8 rounded-full bg-stone-800 border border-amber-900/40 flex items-center justify-center text-sky-400 hover:bg-sky-400 hover:text-white transition-all shadow-lg">
                <Sparkles size={14} />
             </button>
          </div>
        </div>

        {/* Traits Bar */}
        <div className="absolute -bottom-6 left-10 flex items-center gap-1">
          {traits.slice(0, 5).map((trait, i) => (
            <motion.div
              key={trait.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="group relative"
            >
              <div className="w-7 h-7 bg-stone-800 border border-stone-600 rounded flex items-center justify-center text-stone-300 shadow-md cursor-help hover:border-amber-500/50 transition-colors">
                {getIconComponent(trait.lucideIcon)}
              </div>
              <div className="absolute bottom-9 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 border border-amber-900/30 p-3 rounded shadow-2xl w-48 z-50 pointer-events-none">
                <h4 className="text-[10px] font-bold text-amber-400 uppercase mb-1">{trait.name}</h4>
                <p className="serif-font text-[10px] text-stone-400 italic leading-tight">{trait.description}</p>
              </div>
            </motion.div>
          ))}
          {traits.length > 5 && (
            <div className="w-7 h-7 bg-stone-900 border border-stone-700 rounded flex items-center justify-center text-[10px] font-bold text-stone-500">
              +{traits.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Mini Divine Bars */}
      <div className="ml-10 flex flex-col gap-1 w-32 pointer-events-auto mt-6">
        <div className="flex justify-between items-end">
          <span className="text-[8px] font-bold text-amber-500/60 uppercase tracking-tighter">Divinity</span>
          <span className="text-[9px] font-bold text-amber-400">{divineBalance.divinity}</span>
        </div>
        <div className="h-1 bg-stone-800 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-amber-500" style={{ width: `${divineBalance.divinity}%` }} />
        </div>

        <div className="flex justify-between items-end mt-1">
          <span className="text-[8px] font-bold text-purple-500/60 uppercase tracking-tighter">Corruption</span>
          <span className="text-[9px] font-bold text-purple-400">{divineBalance.corruption}</span>
        </div>
        <div className="h-1 bg-stone-800 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-purple-600" style={{ width: `${divineBalance.corruption}%` }} />
        </div>
      </div>
    </div>
  );
}
