import { useCallback, useRef } from 'react';

import { AUTO_SAVE_TIMEOUT } from '../constants';

/**
 * Auto Save
 */
export const useAutoSave = () => {
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Remove Timer
   */
  const removeTimer = useCallback(() => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = null;
    }
  }, []);

  /**
   * Start timer
   */
  const startTimer = useCallback(
    (handler: () => void) => {
      removeTimer();
      autoSaveTimer.current = setTimeout(() => {
        handler();
        autoSaveTimer.current = null;
      }, AUTO_SAVE_TIMEOUT);
    },
    [removeTimer]
  );

  /**
   * Return
   */
  return {
    startTimer,
    removeTimer,
  };
};
