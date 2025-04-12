import { ResponsivePie } from '@nivo/pie';
import { mockRegionalData } from '../data/mockData';

const PieChart = ({ isDashboard = false }) => {
   const data = mockRegionalData.map((item) => ({
      id: item.region,
      label: item.region,
      value: item.projects,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
   }));

   return (
      <ResponsivePie
         data={data}
         margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
         innerRadius={0.5}
         padAngle={0.7}
         cornerRadius={3}
         activeOuterRadiusOffset={8}
         colors={{ scheme: 'green_blue' }}
         borderWidth={1}
         borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
         enableArcLinkLabels={!isDashboard}
         arcLinkLabelsSkipAngle={10}
         arcLinkLabelsTextColor="#333333"
         arcLinkLabelsThickness={2}
         arcLabelsSkipAngle={10}
         legends={[
            {
               anchor: 'bottom',
               direction: 'row',
               justify: false,
               translateX: 0,
               translateY: 56,
               itemsSpacing: 0,
               itemWidth: 100,
               itemHeight: 18,
               itemTextColor: '#999',
               itemDirection: 'left-to-right',
               itemOpacity: 1,
               symbolSize: 18,
               symbolShape: 'circle',
            },
         ]}
      />
   );
};

export default PieChart;
