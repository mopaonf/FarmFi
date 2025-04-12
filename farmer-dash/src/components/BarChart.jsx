import { ResponsiveBar } from '@nivo/bar';
import { mockFundingData } from '../data/mockData';

const BarChart = ({ isDashboard = false }) => {
   return (
      <ResponsiveBar
         data={mockFundingData}
         keys={['value']}
         indexBy="label"
         margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
         padding={0.3}
         valueScale={{ type: 'linear' }}
         colors={({ data }) => data.color}
         borderRadius={4}
         borderWidth={2}
         borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
         axisTop={null}
         axisRight={null}
         axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : 'Project Type',
            legendPosition: 'middle',
            legendOffset: 32,
         }}
         axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : 'Value (%)',
            legendPosition: 'middle',
            legendOffset: -40,
         }}
         enableLabel={true}
         labelSkipWidth={12}
         labelSkipHeight={12}
         labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      />
   );
};

export default BarChart;
