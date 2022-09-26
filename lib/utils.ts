import polyline from '@mapbox/polyline';
import { LngLat } from 'mapbox-gl';
import { ENCODING_PRECISION } from '../constants';

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

export function createLineString(
  name: string,
  color: string,
  path: GeoJSON.Position[],
): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type: 'Feature',
    properties: {
      name,
      color,
    },
    geometry: {
      type: 'LineString',
      coordinates: path,
    },
  };
}

export function swapCoordinates(
  coordinates: Array<[number, number]>,
): Array<[number, number]> {
  let swapped: Array<[number, number]> = [];

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
