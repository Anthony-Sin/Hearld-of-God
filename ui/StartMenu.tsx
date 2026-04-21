import { motion } from 'motion/react';
import { Crown, Play, Settings, Shield, Sparkles, Scroll } from 'lucide-react';

interface StartMenuProps {
  onStart: () => void;
}

export default function StartMenu({ onStart }: StartMenuProps) {
  return (
    <div className="absolute inset-0 z-[100] bg-[#050508] flex items-center justify-center pointer-events-auto overflow-hidden">
      {/* Background Layer: Thematic Atmosphere */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599727710778-95859e2f694a?q=80&w=2000&auto=format&fit=crop')] bg-cover opacity-[0.08] mix-blend-screen" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none" />

      {/* Floating Particle Simulation (CSS only approximation) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '110%', x: `${Math.random() * 100}%`, opacity: 0 }}
            animate={{ y: '-10%', opacity: [0, 1, 0] }}
            transition={{ duration: 10 + Math.random() * 20, repeat: Infinity, delay: Math.random() * 20 }}
            className="absolute w-1 h-1 bg-amber-200 rounded-full blur-[1px]"
          />
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="relative flex flex-col items-center gap-12 max-w-2xl text-center z-10"
      >
        {/* Heraldry Accent */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
          <div className="w-24 h-32 bg-gradient-to-b from-amber-600 to-amber-900 rounded-b-2xl border-x-4 border-b-4 border-white/20 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10">
            <Shield size={48} className="text-black drop-shadow-md" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Crown size={32} className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
          >
            <h1 className="text-7xl font-black tracking-[0.3em] text-white uppercase italic font-serif drop-shadow-[0_5px_15px_rgba(0,0,0,1)] relative">
              Herald of God
              <div className="absolute -inset-x-12 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent -z-10" />
            </h1>
          </motion.div>
          <p className="text-amber-500 font-bold text-[11px] uppercase tracking-[0.8em] drop-shadow-md opacity-80">
            The Envoy of the Eternal King
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex flex-col gap-6 w-full max-w-sm px-4"
        >
          {/* Decorative Filigree Line */}
          <div className="flex items-center gap-4 opacity-30">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white" />
            <Sparkles size={12} className="text-amber-500" />
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white" />
          </div>

          <button 
            onClick={onStart}
            className="w-full h-16 bg-gradient-to-b from-amber-700/20 to-transparent border border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/10 transition-all duration-500 flex items-center justify-center gap-4 group relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Play size={20} className="text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black tracking-[0.4em] text-white uppercase group-hover:text-amber-400 transition-colors">Start the Chronicle</span>
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button className="h-12 bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2 group">
              <Scroll size={14} className="text-white/40 group-hover:text-amber-500 transition-colors" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase group-hover:text-white transition-colors">Load Saga</span>
            </button>
            <button className="h-12 bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2 group">
              <Settings size={14} className="text-white/40 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase group-hover:text-white transition-colors">Settings</span>
            </button>
          </div>
        </motion.div>

        {/* Footer Info */}
        <div className="flex flex-col gap-2 mt-8 opacity-40">
          <p className="text-[9px] text-white font-mono tracking-widest uppercase italic">A Grand Strategy Experience</p>
          <div className="h-[1px] w-12 bg-white/20 mx-auto" />
          <p className="text-[8px] text-white/60 font-mono tracking-widest uppercase">v1.0.4 Apostolic Build</p>
        </div>

        {/* Border Filigree Corners */}
        <div className="fixed top-12 left-12 w-32 h-32 border-t-2 border-l-2 border-amber-900/20 pointer-events-none" />
        <div className="fixed top-12 right-12 w-32 h-32 border-t-2 border-r-2 border-amber-900/20 pointer-events-none" />
        <div className="fixed bottom-12 left-12 w-32 h-32 border-b-2 border-l-2 border-amber-900/20 pointer-events-none" />
        <div className="fixed bottom-12 right-12 w-32 h-32 border-b-2 border-r-2 border-amber-900/20 pointer-events-none" />
      </motion.div>
    </div>
  );
}
