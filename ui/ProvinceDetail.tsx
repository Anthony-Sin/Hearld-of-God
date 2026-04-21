import { MapData, BaronyData } from '@map/mapGenerator';
import { motion } from 'motion/react';
import { Shield, Map as MapIcon, Users, Landmark, TrendingUp } from 'lucide-react';

export default function ProvinceDetail({ selectedProvince, mapData, onDeselect, voxelCount }: {
  selectedProvince: BaronyData | null,
  mapData: MapData,
  onDeselect: () => void,
  voxelCount: number
}) {
  if (!selectedProvince) return null;

  // Retrieve hierarchy info
  const county = mapData.counties[selectedProvince.countyId];
  const duchy = mapData.duchies[selectedProvince.duchyId];
  const kingdom = mapData.kingdoms[selectedProvince.kingdomId];

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      className="flex flex-col items-end gap-4"
    >
      {/* Title / Header */}
      <div className="flex flex-col items-end">
        <h2 className="text-2xl font-black text-white tracking-widest uppercase flex items-center gap-3">
          <span className="w-2 h-8 bg-amber-500/80" />
          {selectedProvince.name}
        </h2>
        <div className="flex gap-2 mt-1">
          <span className="text-[9px] font-bold text-amber-500/60 tracking-[0.2em] uppercase">
            {kingdom?.name} • {duchy?.name} • {county?.name}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 w-64">
        <StatItem icon={<TrendingUp size={10} />} label="Development" value={selectedProvince.development} color="text-sky-400" />
        <StatItem icon={<Shield size={10} />} label="Garrison" value={Math.floor(selectedProvince.development * 45)} color="text-rose-400" />
        <StatItem icon={<Landmark size={10} />} label="Tax Rate" value={`${(selectedProvince.development * 0.1).toFixed(1)}%`} color="text-emerald-400" />
        <StatItem icon={<Users size={10} />} label="Supply" value="100%" color="text-amber-400" />
      </div>

      <button
        onClick={onDeselect}
        className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/20 hover:text-white/60 transition-colors mt-2"
      >
        [ Close Record ]
      </button>
    </motion.div>
  );
}

function StatItem({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className="bg-black/60 backdrop-blur-md border border-white/5 p-3 flex flex-col items-start gap-1">
      <div className="flex items-center gap-1.5">
        <span className="text-white/20">{icon}</span>
        <span className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">{label}</span>
      </div>
      <span className={`text-sm font-black ${color} tracking-wider font-mono`}>{value}</span>
    </div>
  );
}
