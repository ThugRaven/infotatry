import { TRAIL_COLORS, TRAIL_OUTLINE_COLORS } from 'constants/constants';
import { CircleLayer, Expression, LineLayer, SymbolLayer } from 'mapbox-gl';

function getColors(property: string, isOutline?: boolean): Expression {
  return [
    'match',
    ['get', property],
    ['red'],
    isOutline ? TRAIL_OUTLINE_COLORS.RED : TRAIL_COLORS.RED,
    ['blue'],
    isOutline ? TRAIL_OUTLINE_COLORS.BLUE : TRAIL_COLORS.BLUE,
    ['yellow'],
    isOutline ? TRAIL_OUTLINE_COLORS.YELLOW : TRAIL_COLORS.YELLOW,
    ['green'],
    isOutline ? TRAIL_OUTLINE_COLORS.GREEN : TRAIL_COLORS.GREEN,
    ['black'],
    isOutline ? TRAIL_OUTLINE_COLORS.BLACK : TRAIL_COLORS.BLACK,
    '#FFFFFF',
  ];
}

const TRAIL_DRAW_WIDTH_ARRAY = [
  [9, 1 / 2],
  [11, 3 / 2],
  [22, 6 / 2],
];
const TRAIL_DRAW_DASH_ARRAY = [6 * 2, 2 * 2];
const TRAIL_OUTLINE_RATIO = 0.5;
const ROUTE_RATIO = 2;
const TRAIL_HIGHTLIGHT_RATIO = 3;

const trailDrawWidth =
  TRAIL_DRAW_WIDTH_ARRAY[TRAIL_DRAW_WIDTH_ARRAY.length - 1][1];
const trailOutlineWidth =
  trailDrawWidth * TRAIL_OUTLINE_RATIO * 2 + trailDrawWidth;
const dashArrayRatio = trailOutlineWidth / trailDrawWidth;
const trailDrawOutlineDashArray = [
  TRAIL_DRAW_DASH_ARRAY[0] / dashArrayRatio,
  TRAIL_DRAW_DASH_ARRAY[1] / dashArrayRatio,
];

const trailDrawOutlineWidthArray: number[] = [];
const routeWidthArray: number[] = [];
const trailHighlightWidthArray: number[] = [];
TRAIL_DRAW_WIDTH_ARRAY.forEach((value) => {
  const zoom = value[0];
  const width = value[1];

  const outlineWidth = width * TRAIL_OUTLINE_RATIO * 2 + width;
  trailDrawOutlineWidthArray.push(zoom, outlineWidth);
  routeWidthArray.push(zoom, outlineWidth * ROUTE_RATIO);
  trailHighlightWidthArray.push(zoom, outlineWidth * TRAIL_HIGHTLIGHT_RATIO);
  console.log(trailOutlineWidth);
});
console.log(trailDrawOutlineWidthArray);
console.log(routeWidthArray);
console.log(trailHighlightWidthArray);
console.log(trailOutlineWidth);
console.log(dashArrayRatio);
console.log(trailDrawOutlineDashArray);

const trailDrawWidthArray = TRAIL_DRAW_WIDTH_ARRAY.reduce((acc, value) =>
  acc.concat(value),
);

export const trailsDrawLayer: LineLayer = {
  id: 'trails-draw-layer',
  type: 'line',
  source: 'composite',
  filter: ['in', '1-1', ['get', 'offset']],
  paint: {
    'line-color': getColors('color'),
    'line-width': ['interpolate', ['linear'], ['zoom'], ...trailDrawWidthArray],
    'line-dasharray': TRAIL_DRAW_DASH_ARRAY,
  },
};

export const trailsDrawOutlineLayer: LineLayer = {
  ...trailsDrawLayer,
  id: 'trails-draw-outline-layer',
  paint: {
    ...trailsDrawLayer.paint,
    'line-color': getColors('color', true),
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      ...trailDrawOutlineWidthArray,
    ],
    'line-dasharray': trailDrawOutlineDashArray,
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

export const trailsDrawOffset1in3OutlineLayer: LineLayer = {
  ...trailsDrawOffset1in3Layer,
  id: 'trails-draw-offset-1-3-outline-layer',
  paint: {
    ...trailsDrawOutlineLayer.paint,
    'line-offset': -5,
    'line-color': getColors('color_left', true),
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

export const trailsDrawOffset3in3OutlineLayer: LineLayer = {
  ...trailsDrawOffset3in3Layer,
  id: 'trails-draw-offset-3-3-outline-layer',
  paint: {
    ...trailsDrawOutlineLayer.paint,
    'line-offset': 5,
    'line-color': getColors('color_right', true),
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

export const trailsDrawOffset1in2OutlineLayer: LineLayer = {
  ...trailsDrawOffset1in2Layer,
  id: 'trails-draw-offset-1-2-outline-layer',
  paint: {
    ...trailsDrawOutlineLayer.paint,
    'line-offset': -2.5,
    'line-color': getColors('color_left', true),
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

export const trailsDrawOffset2in2OutlineLayer: LineLayer = {
  ...trailsDrawOffset2in2Layer,
  id: 'trails-draw-offset-2-2-outline-layer',
  paint: {
    ...trailsDrawOutlineLayer.paint,
    'line-offset': 2.5,
    'line-color': getColors('color_right', true),
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

export const trailsClosedLayer: SymbolLayer = {
  id: 'trails-closed-layer',
  type: 'symbol',
  source: 'composite',
  layout: {
    'icon-image': 'closed',
    'symbol-placement': 'line',
    'symbol-spacing': 25,
    'icon-allow-overlap': true,
    'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 12, 1],
  },
};

export const trailsDirectionStartEndLayer: SymbolLayer = {
  id: 'trails-direction-start-end-layer',
  type: 'symbol',
  source: 'composite',
  filter: ['in', 'start-end', ['get', 'direction']],
  minzoom: 12,
  layout: {
    'icon-image': 'direction',
    'symbol-placement': 'line',
    'symbol-spacing': 50,
    'icon-offset': [0, 10],
  },
};

export const trailsDirectionEndStartLayer: SymbolLayer = {
  ...trailsDirectionStartEndLayer,
  id: 'trails-direction-end-start-layer',
  filter: ['in', 'end-start', ['get', 'direction']],
  layout: {
    ...trailsDirectionStartEndLayer.layout,
    'icon-rotate': 180,
  },
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
    'text-field': [
      'step',
      ['zoom'],
      '',
      12,
      [
        'match',
        ['get', 'type'],
        ['shelter'],
        ['to-string', ['get', 'name']],
        '',
      ],
      14,
      [
        'match',
        ['get', 'type'],
        ['peak', 'shelter'],
        ['to-string', ['get', 'name']],
        '',
      ],
      16,
      ['to-string', ['get', 'name']],
    ],
    'text-letter-spacing': 0.05,
    'text-offset': [0, 0.5],
    'text-size': ['interpolate', ['linear'], ['zoom'], 12, 10, 22, 14],
    'text-anchor': 'top',
    // 'icon-ignore-placement': true,
    'icon-allow-overlap': true,
    'text-allow-overlap': true,
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
    'line-width': ['interpolate', ['linear'], ['zoom'], ...routeWidthArray],
    'line-dasharray': [0.25, 1.5],
    // 'line-color': '#0081cc',
    // 'line-color': '#f89012',
    'line-color': '#000000',
  },
};

export const trailHighlightLayer: LineLayer = {
  id: 'trail-highlight-layer',
  type: 'line',
  source: 'composite',
  layout: { 'line-cap': 'round' },
  paint: {
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      ...trailHighlightWidthArray,
    ],
    // 'line-color': '#0081cc',
    'line-color': '#f9a743',
  },
};

export const nodeHighlightLayer: CircleLayer = {
  id: 'node-highlight-layer',
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
    'circle-color': '#f9a743',
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
