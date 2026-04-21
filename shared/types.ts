import { MapData, BaronyData } from '../map/types';

export interface GameResources {
  gold: number;
  prestige: number;
  piety: number;
  renown: number;
  goldDelta?: number;
  prestigeDelta?: number;
  pietyDelta?: number;
  renownDelta?: number;
}

export interface HeraldStats {
  authority: number;
  zeal: number;
  cunning: number;
  valor: number;
  wisdom: number;
}

export interface RulerTrait {
  id: string;
  name: string;
  description: string;
  effects: Partial<GameResources>;
  lucideIcon: string;
}

export interface DivineBalance {
  divinity: number;
  corruption: number;
}

export interface HeraldInfo {
  name: string;
  title: string;
}

export interface ExtendedBaronyData extends BaronyData {
  infrastructure?: number;
  military?: number;
  arcane?: number;
}

export type ActiveModal = 'character' | 'military' | 'council' | 'decisions' | 'settings' | null;

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
  heraldStats: HeraldStats;
  divineBalance: DivineBalance;
  heraldInfo: HeraldInfo;
  traits: RulerTrait[];
}
