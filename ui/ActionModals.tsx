import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, Sword, User, Scroll, X, Settings, Sparkles, Skull, Trophy, Flame, Zap, Brain, Lock, Check
} from 'lucide-react';
import { ActiveModal, HeraldStats, Trait, SkillNode, GameResources } from '../shared/types';
import { HERALD_SKILL_TREE } from '../ruler/skills';

interface ActionModalsProps {
  activeModal: ActiveModal;
  closeModal: () => void;
  selectedProvinceName?: string;
  heraldStats: HeraldStats;
  traits: Trait[];
  unlockedSkills: string[];
  unlockSkill: (id: string) => void;
  resources: GameResources;
  updateResources: (delta: Record<string, number>) => void;
}

export default function ActionModals({
  activeModal,
  closeModal,
  selectedProvinceName,
  heraldStats: computedHeraldStats,
  traits,
  unlockedSkills,
  unlockSkill,
  resources,
  updateResources
}: ActionModalsProps) {

  if (!activeModal) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'skills'>('info');

  const getTitle = () => {
    switch (activeModal) {
      case 'character': return 'Herald of the Divine';
      case 'military': return 'Holy Crusade';
      case 'council': return 'Apostolic Council';
      case 'decisions': return 'Divine Mandates';
      case 'settings': return 'Game Settings';
      default: return '';
    }
  };

  const menuItems = {
    character: [
      { label: 'Physical Traits', value: 'Robust, Commanding' },
      { label: 'Mental Traits', value: 'Ambitious, Diligent' },
      { label: 'Dynasty', value: 'The Voxel Lineage' },
      { label: 'Age', value: '34 Summers' }
    ],
    military: [
      { label: 'Total Levies', value: '1,240 Soldiers' },
      { label: 'Professional Men-at-Arms', value: '200 Knights' },
      { label: 'Garrison Strength', value: '450 Defenders' }
    ],
    council: [
      { label: 'Chancellor', value: 'Count of ' + (selectedProvinceName || 'Unknown') },
      { label: 'Marshal', value: 'Sir Voxelot' },
      { label: 'Steward', value: 'Master Coinholder' },
      { label: 'Spymaster', value: 'The Shadow' }
    ],
    decisions: [
      {
        label: 'Sacred Procession',
        cost: '100 Piety',
        gain: '+50 Followers',
        desc: 'Lead a grand march through the capital to gather the faithful.',
        color: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        action: () => updateResources({ piety: -100, followers: 50 }),
        canAfford: (resources.piety || 0) >= 100
      },
      {
        label: 'Commission Holy Relic',
        cost: '500 Gold',
        gain: '+100 Followers, +5 Renown',
        desc: 'Craft a masterwork of faith to draw pilgrims from across the realm.',
        color: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
        action: () => updateResources({ gold: -500, followers: 100, renown: 5 }),
        canAfford: (resources.gold || 0) >= 500
      },
      {
        label: 'Zealous Inquisitions',
        cost: '50 Piety',
        gain: '+10 Authority, +5 Corruption',
        desc: 'Purge the heretics to tighten your grip on the faithful.',
        color: 'bg-red-500/10 border-red-500/30 text-red-500',
        action: () => updateResources({ piety: -50, authority: 10, corruption: 5 }),
        canAfford: (resources.piety || 0) >= 50
      },
      {
        label: 'Alms for the Poor',
        cost: '200 Gold',
        gain: '+30 Followers, -5 Corruption',
        desc: 'Distribute wealth to the needy to show the divine\'s mercy.',
        color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        action: () => updateResources({ gold: -200, followers: 30, corruption: -5 }),
        canAfford: (resources.gold || 0) >= 200
      },
      {
        label: 'Holy Tithe',
        cost: '50 Piety',
        gain: 'Gold from Donations',
        desc: 'Enforce a one-time holy tax on all followers across the realm.',
        color: 'bg-amber-600/10 border-amber-500/30 text-amber-500',
        action: () => updateResources({ piety: -50, gold: resources.followers * 2 }),
        canAfford: (resources.piety || 0) >= 50
      }
    ],
    settings: [
      { label: 'Music Volume', value: '80%' },
      { label: 'UI Scale', value: '100%' },
      { label: 'Difficulty', value: 'Herald (Normal)' },
      { label: 'Autosave', value: 'Monthly' }
    ]
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
                 {activeModal === 'settings' && <Settings size={20} className="text-stone-400" />}
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
                <div className="flex flex-col gap-8">
                  {/* Tabs */}
                  <div className="flex gap-4 border-b border-amber-900/20 pb-4">
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 border transition-all ${activeTab === 'info' ? 'bg-amber-900/20 border-amber-500/50 text-amber-500' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
                    >
                      Character Info
                    </button>
                    <button
                      onClick={() => setActiveTab('skills')}
                      className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 border transition-all ${activeTab === 'skills' ? 'bg-sky-900/20 border-sky-500/50 text-sky-500' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
                    >
                      Celestial Path
                    </button>
                  </div>

                  {activeTab === 'info' ? (
                    <div className="flex flex-col gap-10">
                  {/* Top Stats Section */}
                  <div className="grid grid-cols-5 gap-4">
                    {['authority', 'zeal', 'cunning', 'valor', 'wisdom'].map((stat) => {
                      const Icon = statIcons[stat];
                      return (
                        <div key={stat} className="flex flex-col items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-amber-900/40 transition-all">
                          <Icon size={18} className="text-amber-500/40 group-hover:text-amber-500 transition-colors" />
                          <div className="flex flex-col items-center">
                            <span className="text-[14px] font-black font-serif text-white">{computedHeraldStats[stat as keyof HeraldStats]}</span>
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
                  ) : (
                    <div className="flex flex-col gap-12 py-4">
                      {['wrath', 'grace', 'shadow'].map((branch) => (
                        <div key={branch} className="flex flex-col gap-6">
                          <h3 className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.4em] flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-amber-900/30" />
                            {branch} Branch
                            <span className="flex-1 h-[1px] bg-amber-900/30" />
                          </h3>
                          <div className="grid grid-cols-3 gap-6">
                            {HERALD_SKILL_TREE.filter(n => n.branch === branch).map((node) => {
                              const isUnlocked = unlockedSkills.includes(node.id);
                              const canUnlock = node.requirements.every(req => unlockedSkills.includes(req)) &&
                                               (!node.cost.piety || (resources.piety || 0) >= node.cost.piety) &&
                                               (!node.cost.followers || resources.followers >= node.cost.followers);

                              return (
                                <button
                                  key={node.id}
                                  disabled={isUnlocked || !canUnlock}
                                  onClick={() => unlockSkill(node.id)}
                                  className={`p-4 border rounded-sm flex flex-col gap-3 transition-all text-left relative group ${
                                    isUnlocked ? 'bg-emerald-500/10 border-emerald-500/40' :
                                    canUnlock ? 'bg-white/5 border-white/10 hover:border-amber-500/50 hover:bg-white/10' :
                                    'bg-black/40 border-white/5 opacity-40 cursor-not-allowed'
                                  }`}
                                >
                                  {isUnlocked && <Check size={12} className="absolute top-2 right-2 text-emerald-500" />}
                                  {!isUnlocked && !canUnlock && <Lock size={12} className="absolute top-2 right-2 text-white/20" />}

                                  <div className="flex flex-col gap-1">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-emerald-400' : 'text-amber-500/80'}`}>{node.name}</span>
                                    <p className="text-[9px] text-white/40 leading-tight line-clamp-2">{node.description}</p>
                                  </div>

                                  {!isUnlocked && (
                                    <div className="flex gap-2 mt-auto pt-2 border-t border-white/5">
                                      {node.cost.piety && <span className="text-[8px] font-bold text-sky-400 uppercase">{node.cost.piety} Piety</span>}
                                      {node.cost.followers && <span className="text-[8px] font-bold text-amber-500 uppercase">{node.cost.followers} Foll.</span>}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    {menuItems.decisions.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => item.canAfford && item.action()}
                        disabled={!item.canAfford}
                        className={`flex flex-col p-6 border transition-all group relative overflow-hidden bg-black/40 ${item.canAfford ? 'hover:bg-white/[0.02] hover:translate-x-1 cursor-pointer' : 'opacity-50 cursor-not-allowed'} ${item.color}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-black uppercase tracking-[0.2em] italic font-serif">{item.label}</span>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">{item.gain}</span>
                             <div className="h-4 w-[1px] bg-white/10" />
                             <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-sm border ${item.canAfford ? 'bg-black/60 border-white/10' : 'bg-stone-800 border-transparent text-stone-500'}`}>{item.cost}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-white/40 leading-relaxed max-w-[80%] text-left">{item.desc}</p>
                        {!item.canAfford && <span className="text-[8px] font-bold text-red-500 uppercase mt-2">Cannot Afford</span>}
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

             {activeModal === 'settings' && (
                <div className="flex flex-col gap-4">
                   {menuItems.settings.map((item, i) => (
                    <div key={i} className="flex flex-col gap-1 border-l-2 border-amber-500/30 pl-4 py-1 hover:bg-white/5 transition-colors cursor-default">
                      <span className="serif-font text-[10px] font-bold text-stone-500 uppercase tracking-widest">{item.label}</span>
                      <span className="text-sm text-stone-200 font-medium">{item.value}</span>
                    </div>
                  ))}
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
