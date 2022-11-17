import { CircleLayer, Expression, LineLayer, SymbolLayer } from 'mapbox-gl';
import { TRAIL_COLORS } from '../constants';

function getColors(property: string): Expression {
  return [
    'match',
    ['get', property],
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
  ];
}

export const trailsDrawLayer: LineLayer = {
  id: 'trails-draw-layer',
  type: 'line',
  source: 'composite',
  filter: ['in', '1-1', ['get', 'offset']],
  paint: {
    'line-color': getColors('color'),
    'line-width': ['interpolate', ['linear'], ['zoom'], 9, 1, 11, 3, 22, 3],
    'line-dasharray': [6, 2],
  },
};

export const trailsDrawOffset1in3Layer: LineLayer = {
  ...trailsDrawLayer,
  id: 'trails-draw-offset-1-3-layer',
  filter: ['in', '1-3', ['get', 'offset']],
  paint: {
    ...trailsDrawLayer.paint,
    'line-offset': -5,
    'line-color': getColors('color_left'),
  },
};

export const trailsDrawOffset3in3Layer: LineLayer = {
  ...trailsDrawLayer,
  id: 'trails-draw-offset-3-3-layer',
  filter: ['in', '3-3', ['get', 'offset']],
  paint: {
    ...trailsDrawLayer.paint,
    'line-offset': 5,
    'line-color': getColors('color_right'),
  },
};

export const trailsDrawOffset1in2Layer: LineLayer = {
  ...trailsDrawLayer,
  id: 'trails-draw-offset-1-2-layer',
  filter: ['in', '1-2', ['get', 'offset']],
  paint: {
    ...trailsDrawLayer.paint,
    'line-offset': -2.5,
    'line-color': getColors('color_left'),
  },
};

export const trailsDrawOffset2in2Layer: LineLayer = {
  ...trailsDrawLayer,
  id: 'trails-draw-offset-2-2-layer',
  filter: ['in', '2-2', ['get', 'offset']],
  paint: {
    ...trailsDrawLayer.paint,
    'line-offset': 2.5,
    'line-color': getColors('color_right'),
  },
};

export const trailsDrawLocalLayer: LineLayer = {
  ...trailsDrawLayer,
  id: 'trails-draw-local-layer',
};

export const trailsDrawOffsetLeftLocalLayer: LineLayer = {
  ...trailsDrawLayer,
  id: 'trails-draw-offset-left-local-layer',
};

export const trailsDrawOffsetRightLocalLayer: LineLayer = {
  ...trailsDrawLayer,
  id: 'trails-draw-offset-right-local-layer',
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

export const routeLayer: LineLayer = {
  id: 'route-layer',
  type: 'line',
  source: 'composite',
  layout: { 'line-cap': 'round' },
  paint: {
    'line-width': ['interpolate', ['linear'], ['zoom'], 9, 3, 11, 5, 22, 20],
    'line-dasharray': [0.25, 1.5],
    // 'line-color': '#0081cc',
    // 'line-color': '#f89012',
    'line-color': '#000000',
  },
};
