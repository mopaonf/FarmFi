import { ResponsiveLine } from '@nivo/line';
import { mockProjectProgress } from '../data/mockData';

const LineChart = ({ isDashboard = false }) => {
   return (
      <ResponsiveLine
         data={mockProjectProgress}
         margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
         xScale={{ type: 'point' }}
         yScale={{ type: 'linear', min: 0, max: 100 }}
         curve="cardinal"
         axisTop={null}
         axisRight={null}
         axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : 'Month',
            legendOffset: 36,
            legendPosition: 'middle',
         }}
         axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : 'Progress (%)',
            legendOffset: -40,
            legendPosition: 'middle',
         }}
         colors={['#2e7d32', '#1565c0']}
         pointSize={10}
         pointColor={{ theme: 'background' }}
         pointBorderWidth={2}
         pointBorderColor={{ from: 'serieColor' }}
         enableGridX={false}
         enableArea={true}
         areaOpacity={0.15}
         useMesh={true}
         legends={[
            {
               anchor: 'bottom-right',
               direction: 'column',
               justify: false,
               translateX: 100,
               translateY: 0,
               itemsSpacing: 0,
               itemDirection: 'left-to-right',
               itemWidth: 80,
               itemHeight: 20,
               itemOpacity: 0.75,
               symbolSize: 12,
               symbolShape: 'circle',
            },
         ]}
      />
   );
};

export default LineChart;
