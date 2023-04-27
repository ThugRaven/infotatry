import { TrailColor } from './route-types';

export interface Segment {
  name: string;
  color: TrailColor[];
  distance: number;
  time: number;
  length: number;
  type: string;
  node_id: number;
  trail_id: number;
}

export interface PlannedHike {
  _id: string;
  userId: string;
  query: string;
  name: {
    start: string;
    end: string;
  };
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompletedHike {
  _id: string;
  userId: string;
  query: string;
  name: {
    start: string;
    end: string;
  };
  date: {
    start: string;
    end: string;
  };
  distance: number;
  time: number;
  ascent: number;
  descent: number;
  encoded: string;
  elevations: number[];
  segments: Segment[];
  weatherSite: string;
  createdAt: string;
  updatedAt: string;
}
