import { useCallback, useEffect, useState } from 'react';

export const useKeyboard = (
  targetKeys: string[],
  element: HTMLElement | 'window' | null,
  callback?: ((event: KeyboardEvent) => void)[],
  callOnce = false,
  withControl = false,
  caseSensitive = false,
) => {
  const [keyPressed, setKeyPressed] = useState(false);
  const [called, setCalled] = useState(false);

  const handleKeyDown = useCallback(
    (event: Event) => {
      const { key, ctrlKey } = event as KeyboardEvent;
      console.log(event);
      console.log(key);

      targetKeys.forEach((targetKey, index) => {
        const isKeySame = caseSensitive
          ? key === targetKey
          : key.toLowerCase() === targetKey.toLowerCase();

        if (isKeySame && ((withControl && ctrlKey) || !withControl)) {
          event.preventDefault();
          event.stopPropagation();

          if (callOnce && called) {
            return;
          }

          setKeyPressed(true);
          setCalled((called) => (called ? called : !called));
          callback &&
            callback[index] &&
            callback[index](event as KeyboardEvent);
        }
      });
    },
    [targetKeys, withControl, caseSensitive, callback, callOnce, called],
  );

  const handleKeyUp = useCallback(
    (event: Event) => {
      const { key, ctrlKey } = event as KeyboardEvent;

      targetKeys.forEach((targetKey) => {
        const isKeySame = caseSensitive
          ? key === targetKey
          : key.toLowerCase() === targetKey.toLowerCase();

        if (isKeySame && ((withControl && ctrlKey) || !withControl)) {
          event.preventDefault();
          event.stopPropagation();

          setKeyPressed(false);
          setCalled((called) => (called ? !called : called));
        }
      });
    },
    [targetKeys, withControl, caseSensitive],
  );

  useEffect(() => {
    if (!element) {
      return;
    }

    if (element === 'window') {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    } else {
      element.addEventListener('keydown', handleKeyDown);
      element.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      if (element === 'window') {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      } else {
        element.removeEventListener('keydown', handleKeyDown);
        element.removeEventListener('keyup', handleKeyUp);
      }
    };
  }, [element, handleKeyDown, handleKeyUp]);

  return keyPressed;
};
