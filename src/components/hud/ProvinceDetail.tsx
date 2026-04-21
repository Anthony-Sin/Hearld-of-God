import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Zap, Globe } from 'lucide-react';
import { BaronyData, MapData } from '../../lib/mapGenerator';

interface ProvinceDetailProps {
  selectedProvince: BaronyData | null;
  mapData: MapData;
  onDeselect: () => void;
  voxelCount: number;
}

export default function ProvinceDetail({ selectedProvince, mapData, onDeselect, voxelCount }: ProvinceDetailProps) {
  const baronyCount = mapData.baronies.length;
  
  const county = selectedProvince ? mapData.counties[selectedProvince.countyId] : null;
  const duchy = selectedProvince ? mapData.duchies[selectedProvince.duchyId] : null;
  const kingdom = selectedProvince ? mapData.kingdoms[selectedProvince.kingdomId] : null;
  const empire = selectedProvince ? mapData.empires[selectedProvince.empireId] : null;

  return (
    <div className="text-right flex flex-col gap-4 pointer-events-auto scale-90 origin-top-right">
      <div className="flex flex-col gap-0.5">
        <span className="hud-label text-[10px] tracking-[0.2em] uppercase text-white/40">Voxel Count</span>
        <span className="text-white uppercase text-xs font-bold">{voxelCount.toLocaleString()} BLOCKS</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="hud-label text-[10px] tracking-[0.2em] uppercase text-white/40">Domain Scope</span>
        <span className="text-white font-bold uppercase text-xs">{baronyCount} BARONIES</span>
      </div>

      <AnimatePresence>
        {selectedProvince && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mt-4 p-4 bg-black/80 backdrop-blur-md border border-white/10 flex flex-col gap-4 text-left min-w-[260px] shadow-2xl"
          >
            <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedProvince.color }} />
                <h2 className="text-sm font-black text-white uppercase italic">{selectedProvince.name}</h2>
              </div>
              <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-sm inline-block w-fit">
                Sovereign Province
              </span>
            </div>

            <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-sm border border-white/5">
                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/40 uppercase">Overlord</span>
                    <span className="text-white font-bold" style={{ color: empire?.color }}>{empire?.name}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/40 uppercase">Viceroyalty</span>
                    <span className="text-white font-bold" style={{ color: kingdom?.color }}>{kingdom?.name}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/40 uppercase">Duchy (Empire View)</span>
                    <span className="text-white font-bold" style={{ color: duchy?.color }}>{duchy?.name}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/40 uppercase">County (Local View)</span>
                    <span className="text-white font-bold" style={{ color: county?.color }}>{county?.name}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="hud-label text-[8px] flex items-center gap-1 opacity-50"><User size={8} /> Culture</span>
                <span className="text-[10px] font-medium text-white line-clamp-1">{selectedProvince.culture}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="hud-label text-[8px] flex items-center gap-1 opacity-50"><Shield size={8} /> Religion</span>
                <span className="text-[10px] font-medium text-white line-clamp-1">{selectedProvince.religion}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="hud-label text-[8px] flex items-center gap-1 opacity-50"><Zap size={8} /> Dev Level</span>
                <span className="text-[10px] font-medium text-white">{selectedProvince.development}</span>
              </div>
            </div>
            
            <button 
              onClick={onDeselect}
              className="w-full py-1.5 bg-white/5 hover:bg-white/10 text-[9px] uppercase tracking-widest transition-colors border border-white/10 text-white/40 font-bold"
            >
              Zoom out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
