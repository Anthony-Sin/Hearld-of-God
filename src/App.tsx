import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Map as MapIcon } from 'lucide-react';

// Hooks
import { useGameState } from './hooks/useGameState';
import { useCharacterActions } from './hooks/useCharacterActions';

// Components
import VoxelMap from './components/VoxelMap';
import TopBar from './components/hud/TopBar.tsx';
import PortraitHUD from './components/hud/PortraitHUD.tsx';
import ProvinceDetail from './components/hud/ProvinceDetail.tsx';
import DateHUD from './components/hud/DateHUD.tsx';
import StartMenu from './components/menu/StartMenu.tsx';
import ActionModals from './components/hud/ActionModals.tsx';

// Constants
import { MAP_WIDTH, MAP_DEPTH, SYMBOL_ICONS } from './constants';

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
    gameSpeed,
    setGameSpeed,
    currentDate,
    playerResources,
  } = useGameState();

  const { activeModal, openModal, closeModal } = useCharacterActions();

  const [showRegions, setShowRegions] = useState(true);

  const handleAction = (id: string) => {
    console.log(`Action triggered: ${id}`);
    // Future game logic here: popups for diplomacy, war, etc.
  };

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
        showRegions={showRegions}
        selectedProvinceId={selectedProvinceId}
      />

      {/* Global Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#000000] pointer-events-none opacity-60 z-10" />

      {/* HUD Overlays */}
      <AnimatePresence>
        {isStarted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Top Bar Resources (Moved to float top-left-ish) */}
            <div className="absolute top-6 left-12 h-10 pointer-events-auto z-40">
              <TopBar resources={playerResources} />
            </div>

            {/* Top Right Stats & Selected Province */}
            <div className="absolute top-6 right-8 pointer-events-auto z-40">
              <ProvinceDetail 
                selectedProvince={selectedProvince} 
                mapData={mapData}
                onDeselect={() => setSelectedProvinceId(null)}
                voxelCount={mapData.voxels.length}
              />
            </div>

            {/* Character Portrait (Bottom Left) */}
            <PortraitHUD 
              selectedProvince={selectedProvince} 
              SYMBOL_ICONS={SYMBOL_ICONS} 
              onAction={openModal}
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
                    onClick={() => setShowRegions(!showRegions)}
                    className={`px-3 flex items-center justify-center border transition-all ${showRegions ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'bg-black/60 border-white/10 text-white/30'}`}
                  >
                    <MapIcon size={12} />
                  </button>
                </div>
              </div>

              <DateHUD 
                currentDate={currentDate} 
                gameSpeed={gameSpeed} 
                onSpeedChange={setGameSpeed}
                onMenuClick={openModal}
              />
            </div>

            {/* Action Modals */}
            <ActionModals 
              activeModal={activeModal} 
              closeModal={closeModal} 
              selectedProvinceName={selectedProvince?.name}
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
              <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
              <p className="text-sky-400 font-mono text-[10px] uppercase tracking-[0.4em]">Optimizing World State...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
