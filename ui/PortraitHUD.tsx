import { Heart, Star, Sparkles, Sword, User, Scroll, Crown } from 'lucide-react';
import VoxelCharacter from '@ruler/VoxelCharacter';
import { BaronyData } from '@map/mapGenerator';
import { motion } from 'motion/react';

interface PortraitHUDProps {
  selectedProvince: BaronyData | null;
  onAction?: (action: any) => void;
  SYMBOL_ICONS: Record<string, any>;
}

export default function PortraitHUD({ selectedProvince, onAction, SYMBOL_ICONS }: PortraitHUDProps) {
  // Logic: Attributes scaled to development
  const vitality = 80 + Math.floor((selectedProvince?.development || 0) / 2);
  const prestige = 50 + (selectedProvince?.development || 0);
  const piety = 30 + (selectedProvince?.development || 0);

  return (
    <div className="absolute bottom-8 left-8 flex flex-col gap-3 pointer-events-auto z-30">
      <div className="relative">
        {/* Character Info (Name/Title) */}
        <div className="absolute -top-12 left-2 flex flex-col gap-0 items-start">
          <span className="text-[10px] font-bold text-amber-500/80 tracking-[0.3em] uppercase drop-shadow-md">
            Sovereign Ruler
          </span>
          <h3 className="text-sm font-black text-white tracking-widest uppercase drop-shadow-lg leading-tight">
            {selectedProvince ? selectedProvince.name : 'Voxel King'}
          </h3>
          <div className="h-[1px] w-24 bg-gradient-to-r from-amber-500/50 to-transparent mt-1" />
        </div>

        {/* Attribute HUD */}
        <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-center gap-3 z-30">
            <div className="flex items-center gap-2 group" title={`Health: ${vitality}%`}>
                <div className="w-8 h-8 rounded-full bg-black/90 border border-white/10 flex items-center justify-center text-rose-500 shadow-xl group-hover:border-rose-500/50 transition-colors">
                    <Heart size={14} fill="currentColor" className="opacity-80" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-0.5 rounded text-[8px] text-white">HEALTH</div>
            </div>
            <div className="flex items-center gap-2 group" title={`Prestige: ${prestige}`}>
                <div className="w-8 h-8 rounded-full bg-black/90 border border-white/10 flex items-center justify-center text-amber-400 shadow-xl group-hover:border-amber-400/50 transition-colors">
                    <Star size={14} fill="currentColor" className="opacity-80" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-0.5 rounded text-[8px] text-white">PRESTIGE</div>
            </div>
            <div className="flex items-center gap-2 group" title={`Piety: ${piety}`}>
                <div className="w-8 h-8 rounded-full bg-black/90 border border-white/10 flex items-center justify-center text-sky-400 shadow-xl group-hover:border-sky-400/50 transition-colors">
                    <Sparkles size={14} fill="currentColor" className="opacity-80" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-0.5 rounded text-[8px] text-white">PIETY</div>
            </div>
        </div>

        {/* Circular Voxel Portrait Container */}
        <div className="w-[190px] h-[190px] rounded-full bg-gradient-to-t from-black via-[#0a0a14] to-[#1a1a2e] border-[6px] border-[#2d1c16] relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] ring-1 ring-white/5 group ml-6">
           <VoxelCharacter provinceData={selectedProvince} />
           <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none" />
           <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>

        {/* Anchor Action Tray */}
        <div className="absolute -bottom-4 left-[22px] right-0 flex items-center justify-center gap-1 z-40">
          <motion.button 
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction?.('military')} 
            className="w-10 h-10 rounded-full bg-[#1a0505] border border-red-900/50 flex items-center justify-center text-red-500 shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:bg-red-900/20 transition-colors"
          >
            <Sword size={16} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction?.('character')} 
            className="w-14 h-14 rounded-full bg-[#0a0a0a] border-4 border-[#3b2313] flex items-center justify-center text-white shadow-[0_4px_20px_rgba(0,0,0,0.8)] z-10"
          >
            <User size={24} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction?.('council')} 
            className="w-10 h-10 rounded-full bg-[#1a1505] border border-amber-900/50 flex items-center justify-center text-amber-500 shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:bg-amber-900/20 transition-colors"
          >
            <Scroll size={16} />
          </motion.button>
        </div>

        {/* Coat of Arms (Banner) */}
        <div className="absolute bottom-6 -right-2 w-14 h-20 bg-[#0a0a0a] border-2 border-[#3b2313] flex flex-col items-center justify-start p-1 shadow-2xl z-50">
           <div className="w-full h-1.5 bg-amber-600 mb-1" />
           <div className="w-full flex-1 relative overflow-hidden rounded-sm" 
                style={{ 
                  backgroundColor: selectedProvince?.flag.primaryColor || '#221133',
                }}>
             <div className="absolute inset-0 opacity-40 mix-blend-overlay" 
                  style={{ 
                    backgroundImage: `linear-gradient(45deg, ${selectedProvince?.flag.secondaryColor || '#550000'} 25%, transparent 25%, transparent 50%, ${selectedProvince?.flag.secondaryColor || '#550000'} 50%, ${selectedProvince?.flag.secondaryColor || '#550000'} 75%, transparent 75%, transparent)`,
                    backgroundSize: '12px 12px'
                  }} />
             
             <div className="absolute inset-0 flex items-center justify-center text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
               {selectedProvince && SYMBOL_ICONS[selectedProvince.flag.symbol] ? (
                 (() => {
                    const IconComponent = SYMBOL_ICONS[selectedProvince.flag.symbol];
                    return <IconComponent size={24} />;
                 })()
               ) : <Crown size={24} />}
             </div>
           </div>
           <div className="absolute -bottom-1 inset-x-0 h-1 bg-[#0a0a0a] clip-path-jagged" />
        </div>
      </div>
    </div>
  );
}
