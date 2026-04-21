import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sword, User, Scroll, X, Sparkles, Skull, Trophy, Flame, Zap, Brain } from 'lucide-react';
import { HeraldStats, Trait } from '../shared/types';

interface ActionModalsProps {
  activeModal: 'character' | 'military' | 'council' | 'decisions' | null;
  closeModal: () => void;
  selectedProvinceName?: string;
  heraldStats: HeraldStats;
  traits: Trait[];
}

export default function ActionModals({ activeModal, closeModal, heraldStats: computedHeraldStats, traits }: ActionModalsProps) {

  if (!activeModal) return null;

  const getTitle = () => {
    switch (activeModal) {
      case 'character': return 'Herald of the Divine';
      case 'military': return 'Holy Crusade';
      case 'council': return 'Apostolic Council';
      case 'decisions': return 'Divine Mandates';
      default: return '';
    }
  };

  const statIcons: Record<string, any> = {
    authority: Shield,
    zeal: Flame,
    cunning: Zap,
    valor: Sword,
    wisdom: Brain,
    divinity: Sparkles,
    corruption: Skull,
    renown: Trophy,
    piety: Flame
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none p-12 bg-black/40 backdrop-blur-[2px]">
        <motion.div
           initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
           animate={{ opacity: 1, scale: 1, rotateX: 0 }}
           exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
           className="w-full max-w-2xl bg-[#0a0a0c] border border-[#3b2313]/60 shadow-[0_0_150px_rgba(0,0,0,1)] pointer-events-auto overflow-hidden ring-1 ring-white/5 flex flex-col h-[600px] rounded-sm relative"
           style={{ perspective: '1000px' }}
        >
          {/* Decorative Corner Filigree */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-900/40 pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-900/40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-900/40 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-900/40 pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between px-10 py-6 border-b border-amber-900/20 bg-gradient-to-b from-white/5 to-transparent">
             <div className="flex items-center gap-4">
               <div className="p-2.5 bg-amber-900/20 border border-amber-900/40 rounded-sm">
                 {activeModal === 'military' && <Sword size={20} className="text-red-500" />}
                 {activeModal === 'character' && <User size={20} className="text-white" />}
                 {activeModal === 'council' && <Shield size={20} className="text-amber-500" />}
                 {activeModal === 'decisions' && <Scroll size={20} className="text-sky-500" />}
               </div>
               <div className="flex flex-col">
                 <h2 className="text-xs font-black tracking-[0.4em] uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">{getTitle()}</h2>
                 <span className="text-[9px] font-bold text-amber-500/40 uppercase tracking-[0.2em] mt-0.5 italic font-serif">Canonical Record of the Envoy</span>
               </div>
             </div>
             <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-white/40 hover:text-white">
               <X size={20} />
             </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
             {activeModal === 'character' && (
                <div className="flex flex-col gap-10">
                  {/* Top Stats Section */}
                  <div className="grid grid-cols-5 gap-4">
                    {['authority', 'zeal', 'cunning', 'valor', 'wisdom'].map((stat) => {
                      const Icon = statIcons[stat];
                      return (
                        <div key={stat} className="flex flex-col items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-amber-900/40 transition-all">
                          <Icon size={18} className="text-amber-500/40 group-hover:text-amber-500 transition-colors" />
                          <div className="flex flex-col items-center">
                            <span className="text-[14px] font-black font-serif text-white">{computedHeraldStats[stat as keyof typeof computedHeraldStats]}</span>
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{stat}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                    {/* Detailed Attributes */}
                    <div className="flex flex-col gap-6">
                      <h3 className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] flex items-center gap-3">
                        <span className="h-[1px] flex-1 bg-amber-900/30" />
                        Apostolic Nature
                        <span className="h-[1px] flex-1 bg-amber-900/30" />
                      </h3>
                      <div className="flex flex-col gap-4">
                        {[
                          { label: 'Divine Connection', value: computedHeraldStats.divinity, icon: Sparkles, color: 'text-amber-400' },
                          { label: 'Mortal Corruption', value: computedHeraldStats.corruption, icon: Skull, color: 'text-purple-500' },
                          { label: 'Worldly Renown', value: computedHeraldStats.renown, icon: Trophy, color: 'text-rose-400' },
                          { label: 'Religious Standing', value: computedHeraldStats.piety, icon: Flame, color: 'text-sky-400' }
                        ].map((stat, i) => (
                          <div key={i} className="flex flex-col gap-2 group">
                            <div className="flex justify-between items-end">
                              <div className="flex items-center gap-3">
                                <stat.icon size={12} className={stat.color} />
                                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{stat.label}</span>
                              </div>
                              <span className="text-xs font-black font-mono text-white">{Math.round(stat.value)}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.value}%` }}
                                className={`h-full bg-current ${stat.color} opacity-80`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Traits Section */}
                    <div className="flex flex-col gap-6">
                      <h3 className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] flex items-center gap-3">
                        <span className="h-[1px] flex-1 bg-amber-900/30" />
                        Innate Qualities
                        <span className="h-[1px] flex-1 bg-amber-900/30" />
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {traits.map((trait) => (
                          <div key={trait.id} className="p-4 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-amber-900/30 transition-all rounded-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                              <Sparkles size={10} className="text-amber-500" />
                            </div>
                            <div className="text-[11px] font-black text-amber-500 uppercase tracking-widest mb-1.5 italic font-serif">{trait.name}</div>
                            <div className="text-[10px] text-white/50 leading-relaxed font-medium">{trait.description}</div>
                            {/* Stat Modifiers Summary */}
                            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
                              {Object.entries(trait.statModifiers).map(([s, val]) => {
                                const v = val as number;
                                return (
                                  <span key={s} className={`text-[8px] font-black uppercase px-2 py-0.5 bg-black/40 border border-white/5 rounded-full ${v > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {v > 0 ? '+' : ''}{v} {s.slice(0, 3)}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
             )}

             {activeModal === 'decisions' && (
                <div className="flex flex-col gap-8">
                  <div className="p-6 bg-[#0f0a05] border border-amber-900/30 rounded-sm relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full" />
                    <p className="text-[10px] text-amber-200/50 leading-relaxed uppercase tracking-[0.15em] font-bold text-center italic">
                      "Select a divine mandate to influence the mortal realm. Every act of heaven carries a toll upon the Herald's spirit."
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    {[
                      { label: 'Manifest Holy Presence', cost: '120 Piety', gain: '+15 Divinity', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400', desc: 'Briefly tear the veil between worlds to inspire the faithful.' },
                      { label: 'Sacramental Purge', cost: '80 Piety', gain: '-20 Corruption', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400', desc: 'Cleanse your mortal vessel through intense ritualistic suffering.' },
                      { label: 'Writ of Condemnation', cost: '150 Piety', gain: '+25 Authority', color: 'bg-red-500/10 border-red-500/30 text-red-500', desc: 'Formally cast out a political rival from the grace of the heavens.' },
                      { label: 'Seek Arcane Visions', cost: '50 Piety', gain: '+5 Wisdom', color: 'bg-sky-500/10 border-sky-500/30 text-sky-400', desc: 'Meditate upon the ancient scrolls to unlock hidden truths.' }
                    ].map((item, i) => (
                      <button key={i} className={`flex flex-col p-6 border transition-all group relative overflow-hidden bg-black/40 hover:bg-white/[0.02] hover:translate-x-1 ${item.color}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-black uppercase tracking-[0.2em] italic font-serif">{item.label}</span>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">{item.gain}</span>
                             <div className="h-4 w-[1px] bg-white/10" />
                             <span className="text-[10px] font-black uppercase px-3 py-1 bg-black/60 border border-white/10 rounded-sm">{item.cost}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-white/40 leading-relaxed max-w-[80%] text-left">{item.desc}</p>
                        <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-20 transition-opacity">
                          <Scroll size={40} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
             )}

             {(activeModal === 'military' || activeModal === 'council') && (
                <div className="flex flex-col items-center justify-center py-20 gap-8 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/20 blur-3xl animate-pulse" />
                    <Scroll size={80} className="text-amber-900/40 relative" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-black text-white uppercase tracking-[0.5em] italic font-serif">Sealed Prophecy</h3>
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">This strategic domain is currently locked by fate.</p>
                      <p className="text-[9px] text-white/20 uppercase tracking-[0.2em]">Unlock via Renown Milestones or Divine Favor.</p>
                    </div>
                  </div>
                  <button onClick={closeModal} className="px-10 py-3 border border-amber-900/40 text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 hover:bg-amber-900/20 transition-all mt-4">
                    Return to Reality
                  </button>
                </div>
             )}
          </div>

          {/* Footer Bar */}
          <div className="px-10 py-5 bg-black border-t border-amber-900/20 flex justify-between items-center relative">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Divine Link Active</span>
                </div>
                <div className="h-3 w-[1px] bg-white/10" />
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Epoch: 1066.01.21</span>
             </div>
             <button
                onClick={closeModal}
                className="group flex items-center gap-3"
             >
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/60 group-hover:text-amber-500 transition-colors">Seal Apostolic Record</span>
               <div className="w-8 h-8 rounded-sm border border-amber-900/40 flex items-center justify-center group-hover:border-amber-500/50 transition-all">
                 <X size={14} className="text-amber-900/60 group-hover:text-amber-500" />
               </div>
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
