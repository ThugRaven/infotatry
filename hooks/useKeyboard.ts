import { useCallback, useEffect, useState } from 'react';

export const useKeyboard = (
  targetKey: string,
  element: HTMLElement | Window | null = window,
  callback?: (event: KeyboardEvent) => void,
  callOnce = false,
  withControl = false,
  caseSensitive = false,
) => {
  const [keyPresssed, setKeyPressed] = useState(false);
  const [called, setCalled] = useState(false);

  const handleKeyDown = useCallback(
    (event: Event) => {
      const { key, ctrlKey } = event as KeyboardEvent;
      console.log(event);
      console.log(key);

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
        callback && callback(event as KeyboardEvent);
      }
    },
    [targetKey, withControl, caseSensitive, callback, callOnce, called],
  );

  const handleKeyUp = useCallback(
    (event: Event) => {
      const { key, ctrlKey } = event as KeyboardEvent;
      const isKeySame = caseSensitive
        ? key === targetKey
        : key.toLowerCase() === targetKey.toLowerCase();

      if (isKeySame && ((withControl && ctrlKey) || !withControl)) {
        event.preventDefault();
        event.stopPropagation();

        setKeyPressed(false);
        setCalled((called) => (called ? !called : called));
      }
    },
    [targetKey, withControl, caseSensitive],
  );

  useEffect(() => {
    if (!element) {
      return;
    }

    element.addEventListener('keydown', handleKeyDown);
    element.addEventListener('keyup', handleKeyUp);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      element.removeEventListener('keyup', handleKeyUp);
    };
  }, [element, handleKeyDown, handleKeyUp]);

  return keyPresssed;
};
