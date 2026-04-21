import { useState, useCallback } from 'react';
import { ActiveModal, HeraldStats, DivineBalance, HeraldInfo, RulerTrait } from '../shared/types';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export function useUIState() {
  const [isStarted, setIsStarted] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date(1066, 0, 1));
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Herald & Divine State
  const [heraldInfo, setHeraldInfo] = useState<HeraldInfo>({
    name: 'Heralda the Radiant',
    title: 'Herald of the Silver Flame'
  });

  const [heraldStats, setHeraldStats] = useState<HeraldStats>({
    authority: 8,
    zeal: 12,
    cunning: 6,
    valor: 10,
    wisdom: 9
  });

  const [divineBalance, setDivineBalance] = useState<DivineBalance>({
    divinity: 40,
    corruption: 10
  });

  const [traits, setTraits] = useState<RulerTrait[]>([
    { id: 'ambitious', name: 'Ambitious', description: 'Always seeking more power.', effects: { prestige: 0.1 }, lucideIcon: 'Zap' },
    { id: 'pure', name: 'Divine Vessel', description: 'A conduit for the holy light.', effects: { piety: 0.2 }, lucideIcon: 'Sparkles' },
    { id: 'just', name: 'Just', description: 'Fair and equitable in all things.', effects: { renown: 0.05 }, lucideIcon: 'Scale' }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const startGame = useCallback(() => {
    setIsStarted(true);
    setGameSpeed(1);
  }, []);

  const openModal = useCallback((modal: ActiveModal) => {
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const advanceDate = useCallback(() => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      return next;
    });
  }, []);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  return {
    isStarted,
    startGame,
    gameSpeed,
    setGameSpeed,
    currentDate,
    setCurrentDate,
    activeModal,
    openModal,
    closeModal,
    advanceDate,
    heraldInfo,
    heraldStats,
    divineBalance,
    traits,
    notifications,
    addNotification
  };
}
