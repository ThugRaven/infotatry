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
        <div title="Świeży śnieg">
          <AvalancheProblemNewSnow className={s.icon} />
        </div>
      ) : problem === 'wind' ? (
        <div title="Śnieg przewiany">
          <AvalancheProblemWindSlab className={s.icon} />
        </div>
      ) : problem === 'weak' ? (
        <div title="Śnieg stary (słabe warstwy w starej pokrywie)">
          <AvalancheProblemPersistentWeakLayer className={s.icon} />
        </div>
      ) : problem === 'gliding' ? (
        <div title="Śnieg ślizgający się">
          <AvalancheProblemGlidingSnow className={s.icon} />
        </div>
      ) : problem === 'wet' ? (
        <div title="Śnieg mokry">
          <AvalancheProblemWetSnow className={s.icon} />
        </div>
      ) : null}
    </>
  );
};

export default AvalancheProblem;
