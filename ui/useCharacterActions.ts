import { useState, useCallback } from 'react';

export type ActiveModal = 'character' | 'military' | 'council' | 'decisions' | null;

export function useCharacterActions() {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const openModal = useCallback((modal: ActiveModal) => {
    setActiveModal(modal);
    console.log(`Commanding: ${modal}`);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return {
    activeModal,
    openModal,
    closeModal
  };
}
