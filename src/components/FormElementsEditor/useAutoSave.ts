import { useRef, useCallback } from 'react';
import { AutoSaveTimeout } from '../../constants';

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
      }, AutoSaveTimeout);
    },
    [removeTimer]
  );

  return {
    startTimer,
    removeTimer,
  };
};
