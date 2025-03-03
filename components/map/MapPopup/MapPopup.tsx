import { TrailMarking } from '@components/common';
import DistanceIcon from '@components/icons/DistanceIcon';
import NodeIcon from '@components/icons/NodeIcon';
import { IconButton } from '@components/ui';
import { formatMetersToKm, formatMinutesToHours } from '@lib/utils';
import { useKeyboard } from 'hooks/useKeyboard';
import { PopupAction } from 'pages';
import { Dispatch, ReactNode, forwardRef, memo } from 'react';
import { FaCrosshairs, FaHiking } from 'react-icons/fa';
import {
  MdClose,
  MdErrorOutline,
  MdLandscape,
  MdOutlinePlace,
  MdSchedule,
} from 'react-icons/md';
import { Popup } from 'react-map-gl';
import s from './MapPopup.module.css';

interface MapPopupProps {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
  isClosed: boolean;
  onClose: () => void;
  dispatch?: Dispatch<PopupAction>;
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

const MapPopup = forwardRef<HTMLDivElement | null, MapPopupProps>(
  function MapPopup({ lngLat, features, isClosed, onClose, dispatch }, ref) {
    const divRef =
      ref && typeof ref !== 'function' && ref.current ? ref.current : null;

    const feature =
      features.length > 0 && features[0] && features[0].properties
        ? features[0]
        : null;

    const properties =
      feature && feature.properties ? feature.properties : null;

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
              true,
            )} / ${formatMinutesToHours(properties.time_end_start, true)}`}
          />
          <InfoItem
            icon={<DistanceIcon />}
            text={
              properties.distance > 100
                ? formatMetersToKm(properties.distance, true)
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

    const buttons = dispatch ? (
      <div className={s.buttons}>
        <div className={s.buttons__route}>
          <PopupButton
            icon={<FaHiking />}
            label="Dodaj punkt początkowy (1)"
            onClick={() =>
              dispatch({
                type: 'START_NODE',
                payload: {
                  feature: type,
                  name: feature?.properties?.name ?? null,
                },
              })
            }
          />
          <PopupButton
            icon={<NodeIcon />}
            label="Dodaj punkt pośredni (2)"
            onClick={() =>
              dispatch({
                type: 'MIDDLE_NODE',
                payload: {
                  feature: type,
                  name: feature?.properties?.name ?? null,
                },
              })
            }
          />
          <PopupButton
            icon={<MdLandscape />}
            label="Dodaj punkt końcowy (3)"
            onClick={() =>
              dispatch({
                type: 'END_NODE',
                payload: {
                  feature: type,
                  name: feature?.properties?.name ?? null,
                },
              })
            }
          />
        </div>
        <PopupButton
          icon={<FaCrosshairs />}
          label="Wyśrodkuj kamerę (C)"
          onClick={() => {
            const bounds = feature?.properties?.bounds
              ? JSON.parse(feature.properties.bounds)
              : feature?.properties?.lng
              ? [
                  [feature?.properties?.lng, feature?.properties?.lat],
                  [feature?.properties?.lng, feature?.properties?.lat],
                ]
              : null;

            dispatch({
              type: 'CAMERA',
              payload: {
                feature: type,
                name: null,
                bounds,
              },
            });
          }}
        />
      </div>
    ) : null;

    useKeyboard(
      ['1', '2', '3', 'C'],
      divRef,
      [
        () => {
          dispatch &&
            dispatch({
              type: 'START_NODE',
              payload: {
                feature: type,
                name: feature?.properties?.name ?? null,
              },
            });
        },
        () => {
          dispatch &&
            dispatch({
              type: 'MIDDLE_NODE',
              payload: {
                feature: type,
                name: feature?.properties?.name ?? null,
              },
            });
        },
        () => {
          dispatch &&
            dispatch({
              type: 'END_NODE',
              payload: {
                feature: type,
                name: feature?.properties?.name ?? null,
              },
            });
        },
        () => {
          const bounds = feature?.properties?.bounds
            ? JSON.parse(feature.properties.bounds)
            : feature?.properties?.lng
            ? [
                [feature?.properties?.lng, feature?.properties?.lat],
                [feature?.properties?.lng, feature?.properties?.lat],
              ]
            : null;

          dispatch &&
            dispatch({
              type: 'CAMERA',
              payload: {
                feature: type,
                name: null,
                bounds,
              },
            });
        },
      ],
      true,
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
        maxWidth={undefined}
      >
        {feature && feature.properties && type ? (
          <div className={s.popup}>
            <h3 className={s.feature__name}>{feature.properties.name}</h3>
            {type === 'trail' ? trailInfo : nodeInfo}
            {isClosed && (
              <div className={s.closed}>
                <MdErrorOutline />
                <span>Zamknięty szlak</span>
              </div>
            )}
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
      </Popup>
    );
  },
);

export default memo(MapPopup);
