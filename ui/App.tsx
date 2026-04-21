import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, RefreshCw, Bell } from 'lucide-react';

// Hooks
import { useGameState } from '@shared/useGameState';

// Components
import VoxelMap from '@map/VoxelMap';
import TopBar from './TopBar.tsx';
import PortraitHUD from './PortraitHUD.tsx';
import ProvinceDetail from './ProvinceDetail.tsx';
import DateHUD from './DateHUD.tsx';
import StartMenu from './StartMenu.tsx';
import ActionModals from './ActionModals.tsx';

// Constants
import { MAP_WIDTH, MAP_DEPTH, SYMBOL_ICONS } from '@shared/constants';

export default function App() {
  const {
    isStarted,
    startGame,
    isGenerating,
    regenerate,
    mapData,
    selectedProvinceId,
    setSelectedProvinceId,
    selectedProvince,
    mapMode,
    setMapMode,
    lodLevel,
    setLodLevel,
    gameSpeed,
    setGameSpeed,
    currentDate,
    playerResources,
    heraldStats,
    computedHeraldStats,
    traits,
    activeModal,
    openModal,
    closeModal,
    heraldInfo,
    heraldStats,
    divineBalance,
    traits,
    notifications,
    blessProvince,
    investigate
  } = useGameState();

  return (
    <div className="relative w-full h-screen bg-[#0f0f0f] font-sans text-[#e0e0e0] overflow-hidden">
      {!isStarted && <StartMenu onStart={startGame} />}

      {/* 3D Map Viewport */}
      <VoxelMap 
        mapData={mapData} 
        width={MAP_WIDTH} 
        depth={MAP_DEPTH} 
        onProvinceClick={(id) => {
          if (id === selectedProvinceId) setSelectedProvinceId(null);
          else setSelectedProvinceId(id);
        }}
        selectedProvinceId={selectedProvinceId}
        mapMode={mapMode}
        lodLevel={lodLevel}
        setLodLevel={setLodLevel}
      />

      {/* Global Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#000000] pointer-events-none opacity-60 z-10" />

      {/* HUD Overlays */}
      <AnimatePresence>
        {isStarted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none z-20"
          >
            {/* Top Bar Resources (Full Width Fixed) */}
            <TopBar
              resources={playerResources}
              divineBalance={divineBalance}
              heraldInfo={heraldInfo}
              currentDate={currentDate}
              voxelCount={mapData.voxels.length}
              domainScope={mapData.baronies.length}
              onSettingsClick={() => openModal('settings')}
            />
            {/* Top Bar Resources (Moved to float top-left-ish) */}
            <div className="absolute top-6 left-12 h-10 pointer-events-auto z-40">
              <TopBar stats={computedHeraldStats} />
            </div>

            {/* Province Detail Panel (Slide-in Right) */}
            <ProvinceDetail
              selectedProvince={selectedProvince}
              mapData={mapData}
              onDeselect={() => setSelectedProvinceId(null)}
              onBless={blessProvince}
              onInvestigate={investigate}
              piety={playerResources.piety}
            />

            {/* Character Portrait (Bottom Left) */}
            <PortraitHUD 
              selectedProvince={selectedProvince} 
              heraldInfo={heraldInfo}
              heraldStats={heraldStats}
              traits={traits}
              divineBalance={divineBalance}
              onAction={openModal}
              heraldStats={computedHeraldStats}
              traits={traits}
            />

            {/* Combined Bottom Right Timeline & Map Mode Controls */}
            <div className="absolute bottom-8 right-8 flex flex-col items-end gap-3 pointer-events-auto z-40">
               {/* Map Mode Toggle (Consolidated here) */}
              <div className="flex flex-col gap-0.5 scale-75 origin-bottom-right">
                <span className="hud-label opacity-40 text-right">Cartography Mode</span>
                <div className="flex gap-2">
                  <button 
                    onClick={regenerate}
                    disabled={isGenerating}
                    className="border border-white/10 px-4 py-2 bg-black/60 backdrop-blur-sm hover:bg-white/10 text-[9px] tracking-[0.2em] uppercase font-bold transition-all disabled:opacity-30"
                  >
                    {isGenerating ? 'Synthesizing...' : 'Regenerate'}
                  </button>
                  <button 
                    onClick={() => setMapMode('political')}
                    className={`px-3 py-1 border transition-all text-[9px] font-bold uppercase ${mapMode === 'political' ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'bg-black/60 border-white/10 text-white/30'}`}
                  >
                    Political
                  </button>
                  <button
                    onClick={() => setMapMode('terrain')}
                    className={`px-3 py-1 border transition-all text-[9px] font-bold uppercase ${mapMode === 'terrain' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-black/60 border-white/10 text-white/30'}`}
                  >
                    Terrain
                  </button>
                  <button
                    onClick={() => setMapMode('culture')}
                    className={`px-3 py-1 border transition-all text-[9px] font-bold uppercase ${mapMode === 'culture' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-black/60 border-white/10 text-white/30'}`}
                  >
                    Culture
                  </button>
                </div>
            {/* Bottom Right HUD (Game Speed & Map Modes) */}
            <div className={`absolute bottom-8 flex flex-col items-end gap-3 pointer-events-auto z-40 transition-all duration-500 ${selectedProvinceId ? 'right-[424px]' : 'right-8'}`}>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={regenerate}
                  disabled={isGenerating}
                  className="bg-stone-900/90 border border-amber-900/30 px-4 py-2 hover:bg-stone-800 text-[10px] gothic-font uppercase tracking-widest text-amber-500 transition-all disabled:opacity-30 shadow-2xl"
                >
                  {isGenerating ? 'Synthesizing...' : 'Regenerate World'}
                </button>
                <button
                  onClick={() => setShowRegions(!showRegions)}
                  className={`px-3 flex items-center justify-center border transition-all shadow-2xl ${showRegions ? 'bg-amber-600/20 border-amber-500/50 text-amber-400' : 'bg-stone-900/90 border-amber-900/30 text-stone-500'}`}
                >
                  <MapIcon size={14} />
                </button>
              </div>

              <DateHUD 
                currentDate={currentDate} 
                gameSpeed={gameSpeed} 
                onSpeedChange={setGameSpeed}
                onMenuClick={openModal}
              />
            </div>

            {/* Notification Toast Area */}
            <div className="fixed top-16 right-6 flex flex-col gap-2 z-[60] pointer-events-none items-end w-64">
              <AnimatePresence>
                {notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    className={`p-3 rounded border shadow-2xl backdrop-blur-md pointer-events-auto flex items-start gap-3 w-full ${
                      n.type === 'success' ? 'bg-emerald-900/80 border-emerald-500/50 text-emerald-100' :
                      n.type === 'error' ? 'bg-rose-900/80 border-rose-500/50 text-rose-100' :
                      'bg-stone-900/80 border-amber-900/30 text-stone-200'
                    }`}
                  >
                    <Bell size={14} className="mt-0.5 shrink-0" />
                    <p className="serif-font text-xs font-bold leading-tight">{n.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Action Modals */}
            <ActionModals 
              activeModal={activeModal} 
              closeModal={closeModal} 
              selectedProvinceName={selectedProvince?.name}
              heraldStats={computedHeraldStats}
              traits={traits}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm grid place-items-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="gothic-font text-amber-500 text-xs uppercase tracking-[0.4em]">Optimizing World State...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
