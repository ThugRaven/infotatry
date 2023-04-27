export type TrailColor = 'red' | 'blue' | 'green' | 'yellow' | 'black';

export type TrailSegment = {
  name: string;
  color: TrailColor[];
  distance: number;
  time: number;
  closed: boolean;
  type: string;
  node_id: number;
  trail_id: number;
};

export type Route = {
  name: {
    start: string;
    end: string;
  };
  trails: number[];
  segments?: TrailSegment[];
  distance: number;
  time: number;
  ascent: number;
  descent: number;
  type: 'normal' | 'closed' | 'shortest';
  weatherSite: string;
};
