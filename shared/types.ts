import { MapData, BaronyData } from '../map/types';
import type { HeraldStats, Trait } from '../ruler/state';

export type { HeraldStats, Trait };

export interface GameResources {
  gold: number;
  prestige: number;
  piety: number;
  renown: number;
}

export type ActiveModal = 'character' | 'military' | 'council' | 'decisions' | null;

export interface SharedState {
  isStarted: boolean;
  isGenerating: boolean;
  gameSpeed: number;
  currentDate: Date;
  playerResources: GameResources;
  heraldStats: HeraldStats;
  computedHeraldStats: HeraldStats;
  traits: Trait[];
  selectedProvinceId: number | null;
  mapData: MapData;
  selectedProvince: BaronyData | null;
  activeModal: ActiveModal;
}
