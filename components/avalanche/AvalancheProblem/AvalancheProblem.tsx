import AvalancheProblemGlidingSnow from '@components/icons/AvalancheProblemGlidingSnow';
import AvalancheProblemNewSnow from '@components/icons/AvalancheProblemNewSnow';
import AvalancheProblemPersistentWeakLayer from '@components/icons/AvalancheProblemPersistentWeakLayer';
import AvalancheProblemWetSnow from '@components/icons/AvalancheProblemWetSnow';
import AvalancheProblemWindSlab from '@components/icons/AvalancheProblemWindSlab';
import s from './AvalancheProblem.module.css';

interface AvalancheProblemProps {
  problem: string;
}

const AvalancheProblem = ({ problem }: AvalancheProblemProps) => {
  return (
    <>
      {problem === 'new' ? (
        <AvalancheProblemNewSnow className={s.icon} />
      ) : problem === 'wind' ? (
        <AvalancheProblemWindSlab className={s.icon} />
      ) : problem === 'weak' ? (
        <AvalancheProblemPersistentWeakLayer className={s.icon} />
      ) : problem === 'gliding' ? (
        <AvalancheProblemGlidingSnow className={s.icon} />
      ) : problem === 'wet' ? (
        <AvalancheProblemWetSnow className={s.icon} />
      ) : null}
    </>
  );
};

export default AvalancheProblem;
