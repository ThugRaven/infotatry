import { CircleLayer, LineLayer } from 'mapbox-gl';
import { TRAIL_COLORS } from '../constants';

export const trailsDrawLayer: LineLayer = {
  id: 'trails-draw-layer',
  type: 'line',
  source: 'composite',
  paint: {
    'line-color': [
      'match',
      ['get', 'color'],
      ['red'],
      TRAIL_COLORS.RED,
      ['blue'],
      TRAIL_COLORS.BLUE,
      ['yellow'],
      TRAIL_COLORS.YELLOW,
      ['green'],
      TRAIL_COLORS.GREEN,
      ['black'],
      TRAIL_COLORS.BLACK,
      '#FFFFFF',
    ],
    'line-width': ['interpolate', ['linear'], ['zoom'], 9, 1, 11, 3, 22, 3],
    'line-dasharray': [4, 2],
  },
};

export const trailsDrawLocalLayer: LineLayer = {
  ...trailsDrawLayer,
  id: 'trails-draw-local-layer',
};

export const trailsDataLayer: LineLayer = {
  id: 'trails-data-layer',
  type: 'line',
  source: 'composite',
  paint: {
    'line-width': ['interpolate', ['linear'], ['zoom'], 0, 2, 10, 10, 22, 15],
    'line-opacity': 0,
  },
};

export const trailsDataLocalLayer: LineLayer = {
  ...trailsDataLayer,
  id: 'trails-data-local-layer',
};

export const nodesDrawLayer: CircleLayer = {
  id: 'nodes-draw-layer',
  type: 'circle',
  source: 'composite',
  paint: {
    'circle-color': 'hsl(0, 100%, 100%)',
    'circle-stroke-width': 1,
  },
};

export const nodesDrawLocalLayer: CircleLayer = {
  ...nodesDrawLayer,
  id: 'nodes-draw-local-layer',
};

export const nodesDataLayer: CircleLayer = {
  id: 'nodes-data-layer',
  type: 'circle',
  source: 'composite',
  layout: {},
  paint: { 'circle-radius': 10, 'circle-opacity': 0 },
};

export const nodesDataLocalLayer: CircleLayer = {
  ...nodesDataLayer,
  id: 'nodes-data-local-layer',
};
