import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Sword, Flame, Search, ChevronRight, X, Hash } from 'lucide-react';
import { MapData } from '@map/types';
import { ExtendedBaronyData } from '../shared/types';

interface ProvinceDetailProps {
  selectedProvince: ExtendedBaronyData | null;
  mapData: MapData;
  onDeselect: () => void;
  onBless: (id: number) => void;
  onInvestigate: (id: number) => void;
  piety: number;
  followers?: number;
  castAbility?: (id: string) => void;
}

export default function ProvinceDetail({
  selectedProvince,
  mapData,
  onDeselect,
  onBless,
  onInvestigate,
  piety
}: ProvinceDetailProps) {
  const county = selectedProvince ? mapData.counties[selectedProvince.countyId] : null;
  const duchy = selectedProvince ? mapData.duchies[selectedProvince.duchyId] : null;
  const kingdom = selectedProvince ? mapData.kingdoms[selectedProvince.kingdomId] : null;
  const empire = selectedProvince ? mapData.empires[selectedProvince.empireId] : null;

  // Placeholder sub-stats
  const infra = selectedProvince?.infrastructure ?? 3;
  const mil = selectedProvince?.military ?? 2;
  const arc = selectedProvince?.arcane ?? 1;

  const statBar = (label: string, value: number, max: number, color: string) => (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-[9px] uppercase tracking-tighter text-stone-400">
        <span>{label}</span>
        <span className="font-bold text-stone-200">{value} / {max}</span>
      </div>
      <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {selectedProvince && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-12 right-0 bottom-0 w-80 bg-zinc-900/95 border-l-2 border-amber-900/40 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-40 backdrop-blur-md flex flex-col pointer-events-auto overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-amber-900/20 relative">
            <button
              onClick={onDeselect}
              className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-4 rounded-full border border-white/20 shadow-lg" style={{ backgroundColor: selectedProvince.color }} />
              <h2 className="gothic-font text-2xl font-black text-amber-100 uppercase tracking-tight">{selectedProvince.name}</h2>
            </div>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] bg-amber-500/10 px-2 py-0.5 rounded-sm">
              Sovereign Province
            </span>
          </div>

          {/* Hierarchy Breadcrumb */}
          <div className="px-6 py-3 bg-black/20 flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap border-b border-amber-900/10">
            {[empire, kingdom, duchy, county].filter(Boolean).map((entity, i, arr) => (
              <div key={entity!.id} className="flex items-center gap-1">
                <span
                  className="text-[9px] font-bold hover:underline cursor-pointer transition-colors"
                  style={{ color: entity!.color }}
                >
                  {entity!.name}
                </span>
                {i < arr.length - 1 && <ChevronRight size={10} className="text-stone-600" />}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Culture & Religion */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-stone-800/50 p-2 rounded border border-white/5">
                <Sword size={12} className="text-stone-400" />
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase text-stone-500">Culture</span>
                  <span className="text-xs font-bold text-stone-200">{selectedProvince.culture}</span>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2 bg-stone-800/50 p-2 rounded border border-white/5">
                <Flame size={12} className="text-stone-400" />
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase text-stone-500">Religion</span>
                  <span className="text-xs font-bold text-stone-200">{selectedProvince.religion}</span>
                </div>
              </div>
            </div>

            {/* Development */}
            <div className="bg-stone-800/30 p-4 rounded border border-amber-900/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-amber-500" />
                  <span className="gothic-font text-sm text-stone-200">Dev Level {selectedProvince.development}</span>
                </div>
                <span className="text-[9px] text-stone-500">NEXT LEVEL: 85%</span>
              </div>
              <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500/60" style={{ width: '85%' }} />
              </div>

              <div className="grid gap-3 mt-2">
                {statBar("Infrastructure", infra, 10, "bg-sky-500/60")}
                {statBar("Military", mil, 10, "bg-rose-500/60")}
                {statBar("Arcane", arc, 10, "bg-purple-500/60")}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-2">
              <span className="gothic-font text-[10px] text-stone-500 uppercase tracking-widest border-b border-stone-800 pb-1">Herald Actions</span>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onBless(selectedProvince.id)}
                disabled={piety < 50}
                className={`w-full py-2 px-4 flex items-center justify-between rounded border transition-all ${
                  piety >= 50
                  ? 'bg-amber-600/20 border-amber-500/50 text-amber-200 hover:bg-amber-600/30'
                  : 'bg-stone-800 border-stone-700 text-stone-600 cursor-not-allowed opacity-50'
                }`}
                title={piety < 50 ? "Requires 50 Piety" : ""}
              >
                <div className="flex items-center gap-2">
                  <Flame size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">Bless Province</span>
                </div>
                <span className="text-[10px] font-mono">50 <Hash size={8} className="inline mb-0.5" /></span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onInvestigate(selectedProvince.id)}
                className="w-full py-2 px-4 flex items-center gap-2 rounded bg-stone-800 border border-stone-700 text-stone-200 hover:bg-stone-700 transition-all"
              >
                <Search size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Investigate</span>
              </motion.button>

              <div className="relative group">
                <button
                  disabled
                  className="w-full py-2 px-4 flex items-center gap-2 rounded bg-stone-900 border border-stone-800 text-stone-600 cursor-not-allowed"
                >
                  <Shield size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">Raise Levies</span>
                </button>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded pointer-events-none">
                   <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em]">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
