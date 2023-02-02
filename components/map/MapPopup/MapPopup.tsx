import { TrailMarking } from '@components/common';
import DistanceIcon from '@components/icons/DistanceIcon';
import NodeIcon from '@components/icons/NodeIcon';
import IconButton from '@components/ui/IconButton';
import { formatMetersToKm, formatMinutesToHours } from '@lib/utils';
import { ReactNode } from 'react';
import { FaCrosshairs, FaHiking } from 'react-icons/fa';
import {
  MdClose,
  MdLandscape,
  MdOutlinePlace,
  MdSchedule,
} from 'react-icons/md';
import { Popup } from 'react-map-gl';
import s from './MapPopup.module.css';

interface MapPopupProps {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
  onClose: () => void;
}

const InfoItem = ({ icon, text }: { icon: ReactNode; text?: string }) => {
  return (
    <li className={s.info__item}>
      <div className={s.info__icon}>{icon}</div>
      {text && <span className={s.info__text}>{text}</span>}
    </li>
  );
};

const PopupButton = ({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      className={s.button}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

const MapPopup = ({ lngLat, features, onClose }: MapPopupProps) => {
  const feature =
    features.length > 0 && features[0] && features[0].properties
      ? features[0]
      : null;

  const properties = feature && feature.properties ? feature.properties : null;

  const type = !feature
    ? null
    : feature.layer.id === 'nodes-draw-layer'
    ? 'node'
    : feature.layer.id === 'trails-data-layer'
    ? 'trail'
    : null;

  const trailInfo = type === 'trail' && properties && (
    <>
      <ul className={s.info__list}>
        <InfoItem
          icon={<MdSchedule />}
          text={`${formatMinutesToHours(
            properties.time_start_end,
          )} / ${formatMinutesToHours(properties.time_end_start)}`}
        />
        <InfoItem
          icon={<DistanceIcon />}
          text={
            properties.distance > 100
              ? formatMetersToKm(properties.distance)
              : `${properties.distance} m`
          }
        />
        {properties.color_left && (
          <InfoItem
            icon={<TrailMarking color={properties.color_left} size="sm" />}
          />
        )}
        {properties.color && (
          <InfoItem
            icon={<TrailMarking color={properties.color} size="sm" />}
          />
        )}
        {properties.color_right && (
          <InfoItem
            icon={<TrailMarking color={properties.color_right} size="sm" />}
          />
        )}
      </ul>
    </>
  );

  const nodeInfo = type === 'node' && properties && (
    <>
      <ul className={s.info__list}>
        <InfoItem
          icon={<MdOutlinePlace />}
          text={`${properties.lat}, ${properties.lng}`}
        />
        <InfoItem
          icon={<MdLandscape />}
          text={`${properties.elevation} m n.p.m.`}
        />
      </ul>
    </>
  );

  const buttons = (
    <div className={s.buttons}>
      <div className={s.buttons__route}>
        <PopupButton
          icon={<FaHiking />}
          label="Dodaj punkt początkowy"
          onClick={() => console.log('start')}
        />
        <PopupButton
          icon={<NodeIcon />}
          label="Dodaj punkt pośredni"
          onClick={() => console.log('through')}
        />
        <PopupButton
          icon={<MdLandscape />}
          label="Dodaj punkt końcowy"
          onClick={() => console.log('end')}
        />
      </div>
      <PopupButton
        icon={<FaCrosshairs />}
        label="Wyśrodkuj kamerę"
        onClick={() => console.log('target')}
      />
    </div>
  );

  return (
    <Popup
      className={s.mapbox__popup}
      latitude={lngLat.lat}
      longitude={lngLat.lng}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      closeButton={false}
      maxWidth="300px"
    >
      {feature && feature.properties && type ? (
        <div className={s.popup}>
          <h3 className={s.feature__name}>{feature.properties.name}</h3>
          {type === 'trail' ? trailInfo : nodeInfo}
          {buttons}
        </div>
      ) : null}

      <IconButton
        buttonType="action"
        aria-label="Close"
        onClick={onClose}
        className={s.popup__close}
      >
        <MdClose />
      </IconButton>
      {/* {features.length > 0 && features[0].properties ? (
        <div className={s.container}>{features[0].properties.name}</div>
      ) : (
        <div>Brak informacji</div>
      )} */}
    </Popup>
  );
};

export default MapPopup;
