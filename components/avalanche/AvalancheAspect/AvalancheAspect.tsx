import AspectIcon from '@components/icons/AspectIcon';
import { cardinalDirectionToBooleanArray } from '@lib/utils';
import s from './AvalancheAspect.module.css';

interface AvalancheAspectProps {
  aspect: string;
}

const AvalancheAspect = ({ aspect }: AvalancheAspectProps) => {
  const aspects = aspect.split('-');
  const start = cardinalDirectionToBooleanArray(aspects[0]);
  const end = cardinalDirectionToBooleanArray(aspects[1]);
  const startIndex = start.findIndex((value) => value);
  const endIndex = end.findIndex((value) => value);
  let aspectArray: boolean[] = [];

  if (startIndex < endIndex) {
    aspectArray = start.map((value, index) => {
      if (index > startIndex && index <= endIndex) {
        return true;
      } else {
        return value;
      }
    });
  } else if (endIndex < startIndex) {
    aspectArray = start.map((value, index) => {
      if (index <= endIndex || index > startIndex) {
        return true;
      } else {
        return value;
      }
    });
  } else {
    aspectArray = Array(8).fill(1, 0);
  }

  return (
    <div title={`Wystawy niekorzystne - ${aspect}`}>
      <AspectIcon
        aspect={aspectArray}
        fill={'var(--clr-100)'}
        activeFill={'var(--clr-400)'}
        className={s.aspect}
        aria-label={`Wystawy niekorzystne - ${aspect}`}
      />
    </div>
  );
};

export default AvalancheAspect;
