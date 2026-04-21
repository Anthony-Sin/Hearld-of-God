import { Coins, Star, Hash, Trophy, Settings, Users, Database, Sparkles, Skull, Flame, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { GameResources, DivineBalance, HeraldInfo, HeraldStats } from '../shared/types';

interface TopBarProps {
  resources: GameResources;
  divineBalance: DivineBalance;
  heraldInfo: HeraldInfo;
  currentDate: Date;
  voxelCount: number;
  domainScope: number;
  onSettingsClick: () => void;
  stats: HeraldStats;
}

export default function TopBar({
  resources,
  divineBalance,
  heraldInfo,
  currentDate,
  voxelCount,
  domainScope,
  onSettingsClick,
  stats
}: TopBarProps) {

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDate();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year} AD`;
  };

  const resourceItem = (icon: any, label: string, value: number, delta: number | undefined, color: string) => (
    <div className="flex items-center gap-2 px-3 border-r border-amber-900/20 last:border-r-0 group cursor-help" title={label}>
      <div className={`${color}`}>{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-stone-200 leading-none">{Math.floor(value)}</span>
        {delta !== undefined && (
          <span className={`text-[9px] font-medium ${delta >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );

  const divinityPercent = (stats.divinity / 100) * 100; // Using stats.divinity from ruler state
  const isCorrupted = stats.corruption > stats.divinity;
  const isHoly = stats.divinity > 80;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-12 bg-stone-900/95 border-b-2 border-amber-900/40 flex items-center justify-between px-6 z-60 shadow-2xl backdrop-blur-sm pointer-events-auto"
    >
      {/* Left Cluster: Resources */}
      <div className="flex items-center h-full">
        {resourceItem(<Coins size={16} />, "Gold", resources.gold, resources.goldDelta, "text-amber-400")}
        {resourceItem(<Heart size={16} />, "Followers", resources.followers, resources.followersDelta, "text-rose-500")}
        {resourceItem(<Hash size={16} />, "Piety", resources.piety, resources.pietyDelta, "text-stone-300")}
        {resourceItem(<Trophy size={16} />, "Renown", resources.renown, resources.renownDelta, "text-rose-400")}
        {resourceItem(<Star size={16} />, "Prestige", resources.prestige, resources.prestigeDelta, "text-sky-400")}
      </div>

      {/* Center: Divine Balance */}
      <div className="flex flex-col items-center justify-center w-1/3 px-8">
        <span className="gothic-font text-[9px] tracking-[0.3em] text-amber-500/60 uppercase mb-1">The Divine Balance</span>
        <div className={`relative w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-black shadow-inner ${isCorrupted ? 'animate-pulse' : ''}`}>
          {/* Divinity (Gold) */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-600 to-amber-300 transition-all duration-1000 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
            style={{ width: `${divinityPercent}%`, boxShadow: isHoly ? '0 0 15px #fbbf24' : '' }}
          />
          {/* Corruption (Purple) */}
          <div
            className="absolute right-0 top-0 h-full bg-gradient-to-l from-purple-900 to-indigo-700 transition-all duration-1000 shadow-[0_0_100px_rgba(107,33,168,0.5)]"
            style={{ width: `${stats.corruption}%`, borderLeft: isCorrupted ? '1px solid #ef4444' : 'none' }}
          />
          {isCorrupted && <div className="absolute inset-0 bg-red-500/20 pointer-events-none" />}
        </div>
      </div>

      {/* Right Cluster: Realm Info */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="gothic-font text-sm font-bold text-amber-400 tracking-tight leading-none">{heraldInfo.name}</span>
          <span className="serif-font text-[10px] text-stone-400 italic">{formatDate(currentDate)}</span>
        </div>

        <div className="h-8 w-[1px] bg-amber-900/30" />

        <div className="flex gap-4">
          <div className="flex flex-col items-center group cursor-help" title="Voxel Count">
            <Database size={12} className="text-stone-500" />
            <span className="text-[10px] font-bold text-stone-300">{voxelCount.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center group cursor-help" title="Domain Scope">
            <Users size={12} className="text-stone-500" />
            <span className="text-[10px] font-bold text-stone-300">{domainScope}</span>
          </div>
        </div>

        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-stone-400 hover:text-amber-400"
        >
          <Settings size={18} />
        </button>
      </div>
    </motion.div>
  );
}
