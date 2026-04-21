import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sword, User, Scroll, X, Settings } from 'lucide-react';
import { ActiveModal } from '../shared/types';

interface ActionModalsProps {
  activeModal: ActiveModal;
  closeModal: () => void;
  selectedProvinceName?: string;
}

export default function ActionModals({ activeModal, closeModal, selectedProvinceName }: ActionModalsProps) {
  if (!activeModal) return null;

  const getTitle = () => {
    switch (activeModal) {
      case 'character': return 'Character Sheet';
      case 'military': return 'Military Operations';
      case 'council': return 'Royal Council';
      case 'decisions': return 'Realm Decisions';
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
      { label: 'Hold a Feast', cost: '100 Gold', gain: '+20 Prestige' },
      { label: 'Issue New Coinage', cost: '50 piety', gain: '+2.0 Gold/month' },
      { label: 'Hunt in the Royal Woods', cost: '25 Gold', gain: '-10 Stress' }
    ],
    settings: [
      { label: 'Music Volume', value: '80%' },
      { label: 'UI Scale', value: '100%' },
      { label: 'Difficulty', value: 'Herald (Normal)' },
      { label: 'Autosave', value: 'Monthly' }
    ]
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none p-12">
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           className="w-full max-w-md bg-stone-900 border border-amber-900/30 shadow-[0_0_100px_rgba(0,0,0,1)] pointer-events-auto overflow-hidden rounded-sm"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/20 bg-stone-800/50">
             <div className="flex items-center gap-3">
               {activeModal === 'military' && <Sword size={18} className="text-rose-500" />}
               {activeModal === 'character' && <User size={18} className="text-amber-400" />}
               {activeModal === 'council' && <Shield size={18} className="text-sky-400" />}
               {activeModal === 'decisions' && <Scroll size={18} className="text-amber-500" />}
               {activeModal === 'settings' && <Settings size={18} className="text-stone-400" />}
               <h2 className="gothic-font text-sm font-black tracking-[0.2em] uppercase text-stone-100">{getTitle()}</h2>
             </div>
             <button onClick={closeModal} className="text-stone-500 hover:text-white transition-colors">
               <X size={18} />
             </button>
          </div>

          <div className="p-6 flex flex-col gap-4">
             {(activeModal !== 'decisions') ? (
                (menuItems[activeModal as keyof typeof menuItems] as any[]).map((item, i) => (
                  <div key={i} className="flex flex-col gap-1 border-l-2 border-amber-500/30 pl-4 py-1 hover:bg-white/5 transition-colors cursor-default">
                    <span className="serif-font text-[10px] font-bold text-stone-500 uppercase tracking-widest">{item.label}</span>
                    <span className="text-sm text-stone-200 font-medium">{item.value}</span>
                  </div>
                ))
             ) : (
                menuItems.decisions.map((item, i) => (
                  <button key={i} className="flex items-center justify-between p-4 bg-stone-800/50 border border-amber-900/10 hover:bg-amber-900/10 transition-all text-left group">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-stone-200 uppercase tracking-wider">{item.label}</span>
                      <span className="serif-font text-[10px] text-emerald-400 font-bold tracking-tight">{item.gain}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded group-hover:bg-amber-500 group-hover:text-black transition-colors">{item.cost}</span>
                  </button>
                ))
             )}
          </div>

          <div className="px-6 py-4 bg-black/40 border-t border-amber-900/20 flex justify-end">
             <button onClick={closeModal} className="px-4 py-2 bg-stone-800 border border-amber-900/20 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-amber-400 hover:border-amber-400/40 transition-all">
               Close Record
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
