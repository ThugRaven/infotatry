import { CircleLayer, LineLayer, SymbolLayer } from 'mapbox-gl';
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

export const nodesDrawLayer: SymbolLayer = {
  id: 'nodes-draw-layer',
  type: 'symbol',
  source: 'composite',
  minzoom: 11,
  layout: {
    'icon-image': 'node',
    'icon-size': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 18, 1],
    'text-field': ['step', ['zoom'], '', 16, ['to-string', ['get', 'name']]],
    'text-letter-spacing': 0.05,
    'text-offset': [0, 0.5],
    'text-size': 14,
    'text-anchor': 'top',
  },
  paint: {
    'text-halo-color': 'hsl(0, 0%, 100%)',
    'text-halo-width': 2,
    'text-translate': [0, 0],
  },
};

export const nodesDrawLocalLayer: SymbolLayer = {
  ...nodesDrawLayer,
  id: 'nodes-draw-local-layer',
};

export const trailNodesLayer: CircleLayer = {
  id: 'trail-nodes-layer',
  type: 'circle',
  source: 'composite',
  paint: {
    'circle-radius': [
      'interpolate',
      ['exponential', 1.3],
      ['zoom'],
      0,
      4,
      22,
      8,
    ],
    'circle-color': '#ffa631',
    'circle-stroke-color': '#ffffff',
    'circle-stroke-width': [
      'interpolate',
      ['exponential', 1.3],
      ['zoom'],
      0,
      1.5,
      22,
      3,
    ],
  },
};

export const trailNodesLocalLayer: CircleLayer = {
  ...trailNodesLayer,
  id: 'trail-nodes-local-layer',
};

export const trailNodesSelectedLayer: CircleLayer = {
  ...trailNodesLayer,
  id: 'trail-nodes-selected-layer',
  paint: {
    ...trailNodesLayer.paint,
    'circle-color': '#09ADC3',
  },
};
