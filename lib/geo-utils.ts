import polyline from '@mapbox/polyline';
import { ENCODING_PRECISION } from 'constants/constants';
import { LngLat } from 'mapbox-gl';

export function createPoint(
  properties: GeoJSON.GeoJsonProperties,
  lngLat: LngLat,
): GeoJSON.Feature<GeoJSON.Point> {
  return {
    type: 'Feature',
    properties: properties,
    geometry: {
      type: 'Point',
      coordinates: [lngLat.lng, lngLat.lat],
    },
  };
}

export function createLineString(
  properties: GeoJSON.GeoJsonProperties,
  path: GeoJSON.Position[],
): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type: 'Feature',
    properties: properties,
    geometry: {
      type: 'LineString',
      coordinates: path,
    },
  };
}

export function swapCoordinates(
  coordinates: Array<[number, number]>,
): Array<[number, number]> {
  const swapped: Array<[number, number]> = [];

  if (coordinates.length > 0) {
    for (let i = 0; i < coordinates.length; i++) {
      const coords = coordinates[i];
      swapped.push([coords[1], coords[0]]);
    }
  }

  return swapped;
}

export function encode(coordinates: Array<[number, number]>) {
  return polyline.encode(coordinates, ENCODING_PRECISION);
}

export function decode(path: string): Array<[number, number]> {
  return polyline.decode(path, ENCODING_PRECISION);
}
