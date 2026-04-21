import { useState, useCallback } from 'react';
import { ActiveModal } from '../shared/types';

export function useUIState() {
  const [isStarted, setIsStarted] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date(1066, 0, 1));
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

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
    advanceDate
  };
}
