import { motion } from 'motion/react';
import { Crown, Play, Settings, Shield } from 'lucide-react';

interface StartMenuProps {
  onStart: () => void;
}

export default function StartMenu({ onStart }: StartMenuProps) {
  return (
    <div className="absolute inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-auto overflow-hidden">
      {/* Dynamic Background Noise/Texture could go here */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/castle/1920/1080?blur=10')] bg-cover opacity-20" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative bg-black/80 border border-white/10 p-12 flex flex-col items-center gap-10 shadow-[0_0_100px_rgba(0,0,0,1)] max-w-xl text-center"
      >
        {/* Heraldry Accent */}
        <div className="w-20 h-24 bg-amber-500 rounded-b-xl border-4 border-white/10 flex items-center justify-center shadow-2xl scale-110 mb-2">
           <Shield size={40} className="text-black" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black tracking-[0.2em] text-white uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Herald of God</h1>
          <p className="text-amber-500/60 font-mono text-[10px] uppercase tracking-[0.5em]">The Eternal Voxel Board</p>
        </div>

        <div className="flex flex-col gap-4 w-full px-12">
          <button 
            onClick={onStart}
            className="w-full h-14 bg-white/5 border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Play size={18} className="text-amber-500" />
            <span className="text-sm font-bold tracking-[0.3em] text-white uppercase group-hover:text-amber-400 transition-colors">Start Chronicle</span>
          </button>

          <button className="w-full h-12 bg-transparent border border-white/5 hover:bg-white/5 transition-all flex items-center justify-center gap-2 opacity-60 hover:opacity-100">
            <Settings size={14} className="text-white/40" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">Options</span>
          </button>
        </div>

        <p className="text-[9px] text-white/20 font-mono tracking-widest uppercase">Version 4.2.0 - Stable Build</p>
      </motion.div>
    </div>
  );
}
