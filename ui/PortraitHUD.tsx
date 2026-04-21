import {
  Shield, Zap, Sword, Flame, BookOpen, Star, Crown, Trophy, User, Scroll, Brain, Sparkles, Skull
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import VoxelCharacter from '@ruler/VoxelCharacter';
import { BaronyData } from '@map/types';
import { motion } from 'motion/react';
import { HeraldStats, Trait, HeraldInfo } from '../shared/types';
import { HERALD_SKILL_TREE, HERALD_ABILITIES } from '../ruler/skills';

interface PortraitHUDProps {
  selectedProvince: BaronyData | null;
  heraldInfo: HeraldInfo;
  heraldStats: HeraldStats;
  traits: Trait[];
  onAction?: (action: any) => void;
  SYMBOL_ICONS: Record<string, any>;
  unlockedSkills: string[];
  abilityCooldowns: Record<string, number>;
  castAbility: (id: string) => void;
}

export default function PortraitHUD({
  selectedProvince,
  onAction,
  SYMBOL_ICONS,
  heraldStats: computedHeraldStats,
  traits,
  heraldInfo,
  unlockedSkills,
  abilityCooldowns,
  castAbility
}: PortraitHUDProps) {

  const statConfig = [
    { key: 'authority', icon: Shield, color: 'text-amber-400', label: 'AUTHORITY', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]' },
    { key: 'zeal', icon: Flame, color: 'text-orange-500', label: 'ZEAL', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]' },
    { key: 'cunning', icon: Zap, color: 'text-purple-400', label: 'CUNNING', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.3)]' },
    { key: 'valor', icon: Sword, color: 'text-red-500', label: 'VALOR', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]' },
    { key: 'wisdom', icon: Brain, color: 'text-sky-400', label: 'WISDOM', glow: 'shadow-[0_0_15px_rgba(56,189,248,0.3)]' },
  ];

  return (
    <div className="fixed bottom-8 left-8 flex flex-col gap-3 pointer-events-auto z-30 scale-110 origin-bottom-left">
      <div className="relative">
        {/* Character Info (Name/Title) */}
        <div className="absolute -top-14 left-2 flex flex-col gap-0 items-start">
          <span className="text-[10px] font-black text-amber-500/90 tracking-[0.4em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            {heraldInfo.title}
          </span>
          <h3 className="text-lg font-black text-white tracking-[0.15em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)] leading-tight italic font-serif">
            {heraldInfo.name}
          </h3>
          <div className="h-[2px] w-32 bg-gradient-to-r from-amber-500 via-amber-200/50 to-transparent mt-1" />
        </div>

        {/* Attribute HUD (Mortal Stats) */}
        <div className="absolute -left-4 top-0 bottom-0 flex flex-col justify-center gap-3 z-30">
          {statConfig.map((stat) => {
            const Icon = stat.icon;
            const statValue = computedHeraldStats[stat.key as keyof HeraldStats];
            return (
              <div key={stat.key} className="flex items-center gap-3 group">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-black to-gray-900 border-2 border-amber-900/40 flex items-center justify-center ${stat.color} ${stat.glow} group-hover:border-amber-500/50 transition-all duration-300 relative`}>
                  <div className="absolute inset-0 rounded-full bg-current opacity-5 blur-sm group-hover:opacity-20 transition-opacity" />
                  <Icon size={16} fill="currentColor" className="opacity-90 group-hover:scale-110 transition-transform" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 bg-black/95 backdrop-blur-md px-3 py-1.5 rounded-sm text-[10px] font-black text-white whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-amber-900/30 ring-1 ring-white/5">
                  <span className="tracking-[0.2em]">{stat.label}</span>
                  <span className={`${stat.color} ml-3 text-sm font-serif`}>{statValue}</span>
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

        {/* Active Abilities Bar */}
        <div className="absolute -right-36 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {HERALD_SKILL_TREE.filter(n => n.abilityId && unlockedSkills.includes(n.id)).map(node => {
            const ability = (HERALD_ABILITIES as any)[node.abilityId!];
            const cooldown = abilityCooldowns[ability.id] || 0;
            const Icon = (LucideIcons as any)[ability.icon] || Sparkles;

            return (
              <motion.button
                key={ability.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => castAbility(ability.id)}
                disabled={cooldown > 0}
                className={`w-12 h-12 rounded-sm border flex items-center justify-center shadow-2xl relative group ${
                  cooldown > 0 ? 'bg-black/60 border-white/5 text-white/20' : 'bg-sky-900/40 border-sky-500/50 text-sky-400 hover:bg-sky-500/20'
                }`}
              >
                <Icon size={24} />
                {cooldown > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-black text-[10px] text-white">
                    {cooldown}d
                  </div>
                )}
                <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-white/10 p-3 rounded shadow-2xl w-48 z-50 pointer-events-none">
                   <h4 className="text-[10px] font-black text-sky-400 uppercase mb-1">{ability.name}</h4>
                   <p className="text-[9px] text-white/60 leading-tight">{ability.description}</p>
                   <div className="mt-2 flex gap-2">
                      <span className="text-[8px] font-bold text-sky-500 uppercase">{ability.pietyCost} Piety</span>
                      {ability.followersCost && <span className="text-[8px] font-bold text-amber-500 uppercase">{ability.followersCost} Foll.</span>}
                   </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Anchor Action Tray */}
        <div className="absolute -bottom-6 left-[30px] right-0 flex items-center justify-center gap-2 z-[60]">
          <motion.button 
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction?.('military')} 
            className="w-11 h-11 rounded-full bg-[#1a0505] border-2 border-red-900/60 flex items-center justify-center text-red-500 shadow-[0_10px_20px_rgba(0,0,0,0.6)] hover:bg-red-950/40 hover:border-red-500/50 transition-all group"
            title="Military Operations"
          >
            <Sword size={18} className="group-hover:rotate-12 transition-transform" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, y: -6 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction?.('character')} 
            className="w-16 h-16 rounded-full bg-gradient-to-b from-[#1a1a1a] to-[#050505] border-4 border-[#5c3a21] flex items-center justify-center text-white shadow-[0_15px_30px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.1)] z-10 relative group"
            title="Herald Character Sheet"
          >
            <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <User size={28} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction?.('decisions')}
            className="w-11 h-11 rounded-full bg-[#051a1a] border-2 border-sky-900/60 flex items-center justify-center text-sky-400 shadow-[0_10px_20px_rgba(0,0,0,0.6)] hover:bg-sky-950/40 hover:border-sky-500/50 transition-all group"
            title="Divine Mandates"
          >
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction?.('council')} 
            className="w-11 h-11 rounded-full bg-[#1a1505] border-2 border-amber-900/60 flex items-center justify-center text-amber-500 shadow-[0_10px_20px_rgba(0,0,0,0.6)] hover:bg-amber-950/40 hover:border-amber-500/50 transition-all group"
            title="Royal Council"
          >
            <Scroll size={18} className="group-hover:-rotate-12 transition-transform" />
          </motion.button>
        </div>
      </div>

      {/* Mini Divine Bars */}
      <div className="ml-10 flex flex-col gap-1 w-32 pointer-events-auto mt-6">
        <div className="flex justify-between items-end">
          <span className="text-[8px] font-bold text-amber-500/60 uppercase tracking-tighter">Divinity</span>
          <span className="text-[9px] font-bold text-amber-400">{computedHeraldStats.divinity}</span>
        </div>
        <div className="h-1 bg-stone-800 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-amber-500" style={{ width: `${computedHeraldStats.divinity}%` }} />
        </div>

        <div className="flex justify-between items-end mt-1">
          <span className="text-[8px] font-bold text-purple-500/60 uppercase tracking-tighter">Corruption</span>
          <span className="text-[9px] font-bold text-purple-400">{computedHeraldStats.corruption}</span>
        </div>
        <div className="h-1 bg-stone-800 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-purple-600" style={{ width: `${computedHeraldStats.corruption}%` }} />
        </div>

        {/* Coat of Arms (Banner) */}
        <div className="absolute bottom-8 -right-4 w-16 h-24 bg-[#0a0a0a] border-4 border-[#3b2313] flex flex-col items-center justify-start p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.9)] z-50 transform rotate-2 pointer-events-none">
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
