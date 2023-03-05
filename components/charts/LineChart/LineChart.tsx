// import s from './LineChart.module.css';
import { TrailSegment } from '@components/route/RouteSegments/RouteSegments';
import { ResponsiveLine } from '@nivo/line';
import { TRAIL_COLORS } from 'constants/constants';
import features from '../../../public/features.json';

interface LineChartProps {
  ids: number[];
  segments: TrailSegment[];
}

type LineData = {
  id: string;
  data: {
    x: number;
    y: number;
  }[];
};

const LineChart = ({ ids, segments }: LineChartProps) => {
  const trails = features.trails;
  const data: LineData[] = [];
  const colors: string[] = [];
  let distance = 0;
  let minElevation = Infinity;
  let maxElevation = 0;
  ids.forEach((id, index) => {
    const trail = trails.find((trail) => trail.id === id);

    if (trail?.elevation_profile) {
      const segmentData: {
        x: number;
        y: number;
      }[] = [];

      trail.elevation_profile.forEach((elevation, index) => {
        if (index === 0 && data.length > 0) {
          segmentData.push({
            x: distance - 1,
            y: data[data.length - 1].data[data[data.length - 1].data.length - 1]
              .y,
          });
        }

        if (elevation > maxElevation) {
          maxElevation = elevation;
        }
        if (elevation < minElevation) {
          minElevation = elevation;
        }

        segmentData.push({
          x: distance + index,
          y: elevation,
        });
      });

      distance += trail.elevation_profile.length;
      data.push({
        id: `${trail.id} ${index}`,
        data: segmentData,
      });

      let color = '';
      switch (trail.color[0]) {
        case 'red':
          color = TRAIL_COLORS.RED;
          break;
        case 'blue':
          color = TRAIL_COLORS.BLUE;
          break;
        case 'yellow':
          color = TRAIL_COLORS.YELLOW;
          break;
        case 'green':
          color = TRAIL_COLORS.GREEN;
          break;
        case 'black':
          color = TRAIL_COLORS.BLACK;
          break;
      }
      colors.push(color);
    }
  });

  minElevation = Math.floor(minElevation / 100) * 100 - 100;
  maxElevation = Math.ceil(maxElevation / 100) * 100 + 100;

  console.log(data);
  console.log(colors);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px',
        minWidth: '0',
        maxWidth: '100%',
      }}
    >
      <ResponsiveLine
        data={data}
        colors={colors.map((color) => color)}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        enableGridX={false}
        xScale={{
          type: 'linear',
        }}
        yScale={{
          type: 'linear',
          stacked: false,
          min: minElevation,
          max: maxElevation,
        }}
        isInteractive={true}
        // enableSlices={'x'}
        useMesh={true}
        enablePoints={false}
        curve={'monotoneX'}
      />
    </div>
  );
};

export default LineChart;
