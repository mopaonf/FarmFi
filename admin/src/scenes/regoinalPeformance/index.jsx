import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { mockRegionalData } from '../../data/mockData';
import BarChart from '../../components/BarChart';

const RegionalPerformancePage = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);

   return (
      <Box m="20px">
         {/* Header */}
         <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
               REGIONAL PERFORMANCE
            </Typography>
            <Typography variant="subtitle1" color={colors.greenAccent[400]}>
               Analyze project distribution and performance across regions
            </Typography>
         </Box>

         {/* Summary Statistics */}
         <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
            gap={4}
            mb={4}
         >
            {mockRegionalData.map((region) => (
               <Box
                  key={region.region}
                  bgcolor={colors.primary[400]}
                  p={3}
                  borderRadius="8px"
                  textAlign="center"
                  boxShadow="0px 4px 15px rgba(0, 0, 0, 0.2)"
               >
                  <Typography
                     variant="h6"
                     fontWeight="bold"
                     color={colors.greenAccent[400]}
                  >
                     {region.region}
                  </Typography>
                  <Typography
                     variant="h4"
                     fontWeight="bold"
                     color={colors.grey[100]}
                  >
                     {region.projects}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]}>
                     Projects
                  </Typography>
               </Box>
            ))}
         </Box>

         {/* Bar Chart */}
         <Box
            bgcolor={colors.primary[400]}
            p={4}
            borderRadius="8px"
            boxShadow="0px 4px 15px rgba(0, 0, 0, 0.2)"
         >
            <Typography
               variant="h5"
               fontWeight="bold"
               color={colors.grey[100]}
               mb={2}
            >
               Project Distribution by Region
            </Typography>
            <Box height="400px">
               <BarChart data={mockRegionalData} />
            </Box>
         </Box>
      </Box>
   );
};

export default RegionalPerformancePage;
