import { SkillNode, ActiveAbility } from '../shared/types';

export const HERALD_SKILL_TREE: SkillNode[] = [
  // Wrath Branch (Military/Power)
  {
    id: 'divine_wrath',
    name: 'Divine Wrath',
    description: 'Strike fear into the hearts of the unfaithful. +2 Valor.',
    branch: 'wrath',
    cost: { piety: 100, followers: 50 },
    requirements: [],
    statModifiers: { valor: 2 }
  },
  {
    id: 'holy_crusade',
    name: 'Holy Crusade',
    description: 'Unlocks the "Summon Crusaders" ability.',
    branch: 'wrath',
    cost: { piety: 250, followers: 200 },
    requirements: ['divine_wrath'],
    abilityId: 'summon_crusaders'
  },
  {
    id: 'shatter_fortress',
    name: 'Shatter Fortress',
    description: 'Unlocks the "Divine Cataclysm" ability. -5 Corruption.',
    branch: 'wrath',
    cost: { piety: 500, followers: 1000 },
    requirements: ['holy_crusade'],
    abilityId: 'divine_cataclysm',
    statModifiers: { corruption: -5 }
  },

  // Grace Branch (Religion/Piety)
  {
    id: 'radiant_aura',
    name: 'Radiant Aura',
    description: 'A soothing light surrounds you. +2 Zeal.',
    branch: 'grace',
    cost: { piety: 100, followers: 50 },
    requirements: [],
    statModifiers: { zeal: 2 }
  },
  {
    id: 'miraculous_healing',
    name: 'Miraculous Healing',
    description: 'Unlocks the "Heal Land" ability.',
    branch: 'grace',
    cost: { piety: 200, followers: 150 },
    requirements: ['radiant_aura'],
    abilityId: 'heal_land'
  },
  {
    id: 'heavenly_ascent',
    name: 'Heavenly Ascent',
    description: 'Ascend to a higher state of divinity. +20 Divinity.',
    branch: 'grace',
    cost: { piety: 600, followers: 1500 },
    requirements: ['miraculous_healing'],
    statModifiers: { divinity: 20 }
  },

  // Shadow Branch (Cunning/Corruption)
  {
    id: 'whispers_of_the_void',
    name: 'Whispers of the Void',
    description: 'The shadows speak to you. +2 Cunning.',
    branch: 'shadow',
    cost: { piety: 50, gold: 100 },
    requirements: [],
    statModifiers: { cunning: 2 }
  },
  {
    id: 'veiled_influence',
    name: 'Veiled Influence',
    description: 'Influence the realm from the shadows. +5 Corruption, +2 Authority.',
    branch: 'shadow',
    cost: { gold: 500, followers: 100 },
    requirements: ['whispers_of_the_void'],
    statModifiers: { corruption: 5, authority: 2 }
  },
  {
    id: 'reap_souls',
    name: 'Reap Souls',
    description: 'Unlocks the "Shadow Harvest" ability.',
    branch: 'shadow',
    cost: { piety: 300, gold: 1000 },
    requirements: ['veiled_influence'],
    abilityId: 'shadow_harvest'
  }
];

export const HERALD_ABILITIES: Record<string, ActiveAbility> = {
  'summon_crusaders': {
    id: 'summon_crusaders',
    name: 'Summon Crusaders',
    description: 'Call upon 500 holy warriors to aid the realm.',
    pietyCost: 150,
    followersCost: 50,
    cooldown: 30,
    icon: 'Sword'
  },
  'divine_cataclysm': {
    id: 'divine_cataclysm',
    name: 'Divine Cataclysm',
    description: 'Unleash heaven\'s fury upon a province, resetting its corruption.',
    pietyCost: 400,
    followersCost: 200,
    cooldown: 90,
    icon: 'Flame'
  },
  'heal_land': {
    id: 'heal_land',
    name: 'Heal Land',
    description: 'Instantly increase a province\'s development by 1.',
    pietyCost: 100,
    followersCost: 20,
    cooldown: 15,
    icon: 'Sparkles'
  },
  'shadow_harvest': {
    id: 'shadow_harvest',
    name: 'Shadow Harvest',
    description: 'Gain 500 Gold at the cost of 10 Corruption.',
    pietyCost: 50,
    followersCost: 100,
    cooldown: 60,
    icon: 'Skull'
  }
};
