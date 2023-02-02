import { TrailColor } from 'pages/dashboard/admin/map';
import s from './TrailMarking.module.css';

interface TrailMarkingProps {
  color: TrailColor;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const TrailMarking = ({ color, size }: TrailMarkingProps) => {
  return (
    <div
      className={`${s.marking} ${s[`marking--${color}`]} ${
        s[`marking--${size}`]
      }`}
    ></div>
  );
};

export default TrailMarking;
