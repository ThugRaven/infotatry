import classNames from 'classnames';
import { TrailColor } from 'types/route-types';
import s from './TrailMarking.module.css';

interface TrailMarkingProps {
  color: TrailColor;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const TrailMarking = ({ color, size }: TrailMarkingProps) => {
  let colorTitle = '';
  switch (color) {
    case 'red': {
      colorTitle = 'czerwony';
      break;
    }
    case 'blue': {
      colorTitle = 'niebieski';
      break;
    }
    case 'yellow': {
      colorTitle = 'żółty';
      break;
    }
    case 'green': {
      colorTitle = 'zielony';
      break;
    }
    case 'black': {
      colorTitle = 'czarny';
      break;
    }
  }

  return (
    <div
      className={classNames(
        s.marking,
        s[`marking--${color}`],
        s[`marking--${size}`],
      )}
      title={`Szlak ${colorTitle}`}
    ></div>
  );
};

export default TrailMarking;
