import classNames from 'classnames';
import { Dispatch } from 'react';
import { MdMap, MdOutlineSatellite, MdOutlineViewInAr } from 'react-icons/md';
import { MapStyleAction, MapStyleState } from '../MapContainer/MapContainer';
import s from './MapStyles.module.css';

interface MapStylesProps {
  padding?: number;
  style: MapStyleState;
  dispatch?: Dispatch<MapStyleAction>;
}

const MapStyles = ({ padding, style, dispatch }: MapStylesProps) => {
  const styles: ({ icon: JSX.Element; name: string } & MapStyleAction)[] = [
    {
      icon: <MdMap />,
      name: 'Domyślna',
      type: 'DEFAULT',
    },
    {
      icon: <MdOutlineSatellite />,
      name: 'Satelitarna',
      type: 'SATELLITE',
    },
    {
      icon: <MdOutlineViewInAr />,
      name: '3D',
      type: '3D',
    },
  ];

  return (
    <ul
      className={s.list}
      style={{
        transform: `translateX(${padding}px)`,
      }}
    >
      {dispatch &&
        styles.map(({ icon, name, type }) => (
          <li key={name}>
            <button
              className={classNames(s.item, {
                [s['item--active']]:
                  type === style.type || (type === '3D' && style.terrain),
              })}
              onClick={() =>
                dispatch({
                  type,
                } as MapStyleAction)
              }
            >
              {icon}
              <span>{name}</span>
            </button>
          </li>
        ))}
    </ul>
  );
};

export default MapStyles;
