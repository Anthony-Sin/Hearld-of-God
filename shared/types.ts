import { MapData, BaronyData } from '../map/types';

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
  selectedProvinceId: number | null;
  mapData: MapData;
  selectedProvince: BaronyData | null;
  activeModal: ActiveModal;
}
