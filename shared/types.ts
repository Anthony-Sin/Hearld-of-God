import { MapData, BaronyData, Biome, MapMode, LODLevel } from '../map/types';
import type { HeraldStats, Trait } from '../ruler/state';

export type { Biome, MapMode, LODLevel, HeraldStats, Trait };

export interface GameResources {
  gold: number;
  prestige: number;
  piety: number;
  renown: number;
  followers: number;
  goldDelta?: number;
  prestigeDelta?: number;
  pietyDelta?: number;
  renownDelta?: number;
  followersDelta?: number;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  branch: 'wrath' | 'grace' | 'shadow';
  cost: {
    piety?: number;
    followers?: number;
    gold?: number;
  };
  requirements: string[];
  abilityId?: string;
  statModifiers?: Partial<HeraldStats>;
}

export interface ActiveAbility {
  id: string;
  name: string;
  description: string;
  pietyCost: number;
  followersCost?: number;
  cooldown: number; // in days
  icon: string;
}

export interface RulerTrait {
  id: string;
  name: string;
  description: string;
  effects: Partial<GameResources>;
  lucideIcon: string;
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
  heraldStats: HeraldStats;
  computedHeraldStats: HeraldStats;
  traits: Trait[];
  selectedProvinceId: number | null;
  mapData: MapData;
  selectedProvince: BaronyData | null;
  activeModal: ActiveModal;
  heraldInfo: HeraldInfo;
  unlockedSkills: string[];
  abilityCooldowns: Record<string, number>;
}
