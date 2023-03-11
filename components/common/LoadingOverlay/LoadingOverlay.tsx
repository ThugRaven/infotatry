import { Spinner } from '@chakra-ui/react';
import s from './LoadingOverlay.module.css';

const LoadingOverlay = () => {
  return (
    <div className={s.overlay}>
      <Spinner thickness="5px" size="xl" className={s.spinner} />
    </div>
  );
};

export default LoadingOverlay;
