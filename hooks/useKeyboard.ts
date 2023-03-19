import { useCallback, useEffect, useState } from 'react';

export const useKeyboard = (
  targetKey: string,
  callback?: (event: KeyboardEvent) => void,
  callOnce = false,
  withControl = false,
  caseSensitive = false,
) => {
  const [keyPresssed, setKeyPressed] = useState(false);
  const [called, setCalled] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, ctrlKey } = event;
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
        callback && callback(event);
      }
    },
    [targetKey, withControl, caseSensitive, callback, callOnce, called],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const { key, ctrlKey } = event;
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
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return keyPresssed;
};
