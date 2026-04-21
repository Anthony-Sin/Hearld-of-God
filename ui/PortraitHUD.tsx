import {
  Shield, Zap, Sword, Flame, BookOpen, Scale, Sparkles, Star,
  Crown, Heart, Coins, Trophy, Hash
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import VoxelCharacter from '@ruler/VoxelCharacter';
import { BaronyData } from '@map/types';
import { motion, AnimatePresence } from 'motion/react';
import { HeraldStats, RulerTrait, DivineBalance, HeraldInfo } from '../shared/types';
import { Shield, Sparkles, Sword, User, Scroll, Crown, Brain, Flame, Zap } from 'lucide-react';
import VoxelCharacter from '@ruler/VoxelCharacter';
import { BaronyData } from '@map/mapGenerator';
import { motion } from 'motion/react';
import { HeraldStats, Trait } from '../shared/types';

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
  SYMBOL_ICONS: Record<string, any>;
  heraldStats: HeraldStats;
  traits: Trait[];
}

export default function PortraitHUD({ selectedProvince, onAction, SYMBOL_ICONS, heraldStats: computedHeraldStats, traits }: PortraitHUDProps) {

  const statConfig = [
    { key: 'authority', icon: Shield, color: 'text-amber-400', label: 'AUTHORITY', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]' },
    { key: 'zeal', icon: Flame, color: 'text-orange-500', label: 'ZEAL', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]' },
    { key: 'cunning', icon: Zap, color: 'text-purple-400', label: 'CUNNING', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.3)]' },
    { key: 'valor', icon: Sword, color: 'text-red-500', label: 'VALOR', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]' },
    { key: 'wisdom', icon: Brain, color: 'text-sky-400', label: 'WISDOM', glow: 'shadow-[0_0_15px_rgba(56,189,248,0.3)]' },
  ];

  return (
    <div className="absolute bottom-8 left-8 flex flex-col gap-3 pointer-events-auto z-30 scale-110 origin-bottom-left">
      <div className="relative">
        {/* Character Info (Name/Title) */}
        <div className="absolute -top-14 left-2 flex flex-col gap-0 items-start">
          <span className="text-[10px] font-black text-amber-500/90 tracking-[0.4em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            Divine Herald
          </span>
          <h3 className="text-lg font-black text-white tracking-[0.15em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)] leading-tight italic font-serif">
            The Envoy of Heaven
          </h3>
          <div className="h-[2px] w-32 bg-gradient-to-r from-amber-500 via-amber-200/50 to-transparent mt-1" />
        </div>

        {/* Attribute HUD (Mortal Stats) */}
        <div className="absolute -left-4 top-0 bottom-0 flex flex-col justify-center gap-3 z-30">
          {statConfig.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.key} className="flex items-center gap-3 group">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-black to-gray-900 border-2 border-amber-900/40 flex items-center justify-center ${stat.color} ${stat.glow} group-hover:border-amber-500/50 transition-all duration-300 relative`}>
                  <div className="absolute inset-0 rounded-full bg-current opacity-5 blur-sm group-hover:opacity-20 transition-opacity" />
                  <Icon size={16} fill="currentColor" className="opacity-90 group-hover:scale-110 transition-transform" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 bg-black/95 backdrop-blur-md px-3 py-1.5 rounded-sm text-[10px] font-black text-white whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-amber-900/30 ring-1 ring-white/5">
                  <span className="tracking-[0.2em]">{stat.label}</span>
                  <span className={`${stat.color} ml-3 text-sm font-serif`}>{computedHeraldStats[stat.key as keyof typeof computedHeraldStats]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Circular Voxel Portrait Container */}
        <div className="w-[210px] h-[210px] rounded-full bg-gradient-to-t from-[#050508] via-[#0a0a14] to-[#1a1a2e] border-[8px] border-double border-[#3b2313] relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9),inset_0_0_40px_rgba(0,0,0,1)] ring-2 ring-amber-900/20 group ml-8">
           <VoxelCharacter
             provinceData={selectedProvince}
             stats={computedHeraldStats}
             traitIds={traits.map(t => t.id)}
           />
           {/* Divine Shine Overlay */}
           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/5 to-white/10 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
           <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />
           <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

           {/* Inner Border Glow */}
           <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
        </div>

        {/* Anchor Action Tray */}
        <div className="absolute -bottom-6 left-[30px] right-0 flex items-center justify-center gap-2 z-40">
          <motion.button 
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction?.('military')} 
            className="w-11 h-11 rounded-full bg-[#1a0505] border-2 border-red-900/60 flex items-center justify-center text-red-500 shadow-[0_10px_20px_rgba(0,0,0,0.6)] hover:bg-red-950/40 hover:border-red-500/50 transition-all group"
          >
            <Sword size={18} className="group-hover:rotate-12 transition-transform" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, y: -6 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction?.('character')} 
            className="w-16 h-16 rounded-full bg-gradient-to-b from-[#1a1a1a] to-[#050505] border-4 border-[#5c3a21] flex items-center justify-center text-white shadow-[0_15px_30px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.1)] z-10 relative group"
          >
            <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <User size={28} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction?.('council')} 
            className="w-11 h-11 rounded-full bg-[#1a1505] border-2 border-amber-900/60 flex items-center justify-center text-amber-500 shadow-[0_10px_20px_rgba(0,0,0,0.6)] hover:bg-amber-950/40 hover:border-amber-500/50 transition-all group"
          >
            <Scroll size={18} className="group-hover:-rotate-12 transition-transform" />
          </motion.button>
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
        {/* Coat of Arms (Banner) */}
        <div className="absolute bottom-8 -right-4 w-16 h-24 bg-[#0a0a0a] border-4 border-[#3b2313] flex flex-col items-center justify-start p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.9)] z-50 transform rotate-2">
           <div className="w-full h-2 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 mb-1.5 shadow-sm" />
           <div className="w-full flex-1 relative overflow-hidden rounded-sm ring-1 ring-black/50"
                style={{ 
                  backgroundColor: selectedProvince?.flag.primaryColor || '#221133',
                }}>
             <div className="absolute inset-0 opacity-40 mix-blend-overlay" 
                  style={{ 
                    backgroundImage: `linear-gradient(45deg, ${selectedProvince?.flag.secondaryColor || '#550000'} 25%, transparent 25%, transparent 50%, ${selectedProvince?.flag.secondaryColor || '#550000'} 50%, ${selectedProvince?.flag.secondaryColor || '#550000'} 75%, transparent 75%, transparent)`,
                    backgroundSize: '12px 12px'
                  }} />
             
             <div className="absolute inset-0 flex items-center justify-center text-white/95 drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)]">
               {selectedProvince && SYMBOL_ICONS[selectedProvince.flag.symbol] ? (
                 (() => {
                    const IconComponent = SYMBOL_ICONS[selectedProvince.flag.symbol];
                    return <IconComponent size={28} />;
                 })()
               ) : <Crown size={28} />}
             </div>
             {/* Fabric Texture Overlay */}
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
           </div>
           {/* Jagged Bottom Edge Effect */}
           <div className="absolute -bottom-2 inset-x-0 h-4 flex justify-between px-[1px]">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="w-2.5 h-2.5 bg-[#0a0a0a] border-b-4 border-r-4 border-[#3b2313] transform rotate-45 -mt-1.5" />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
