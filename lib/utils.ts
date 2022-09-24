import { LngLat } from 'mapbox-gl';

export function createPoint(
  name: string,
  lngLat: LngLat,
): GeoJSON.Feature<GeoJSON.Point> {
  return {
    type: 'Feature',
    properties: {
      name,
    },
    geometry: {
      type: 'Point',
      coordinates: [lngLat.lng, lngLat.lat],
    },
  };
}
