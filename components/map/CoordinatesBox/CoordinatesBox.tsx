import s from './CoordinatesBox.module.css';

interface CoordinatesBoxProps {
  latitude: number;
  longitude: number;
  zoom: number;
}

const CoordinatesBox = ({ latitude, longitude, zoom }: CoordinatesBoxProps) => {
  return (
    <div className={s.container}>
      Latitude: {latitude.toFixed(5)} | Longitude: {longitude.toFixed(5)} |
      Zoom: {zoom.toFixed(2)}
    </div>
  );
};

export default CoordinatesBox;
