import { useState, useCallback } from 'react';
import { ActiveModal, HeraldInfo } from '../shared/types';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export function useUIState() {
  const [isStarted, setIsStarted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date(1066, 0, 1));
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Herald & Divine UI specific info
  const [heraldInfo, setHeraldInfo] = useState<HeraldInfo>({
    name: 'Heralda the Radiant',
    title: 'Herald of the Silver Flame'
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const startCreation = useCallback(() => {
    setIsCreating(true);
  }, []);

  const cancelCreation = useCallback(() => {
    setIsCreating(false);
  }, []);

  const startGame = useCallback((info: HeraldInfo) => {
    setHeraldInfo(info);
    setIsCreating(false);
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
    isCreating,
    startCreation,
    cancelCreation,
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
    notifications,
    addNotification
  };
}
