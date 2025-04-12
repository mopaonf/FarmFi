import { Box, Button, Typography, IconButton, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import StatBox from '../../components/StatBox';
import LineChart from '../../components/LineChart';
import BarChart from '../../components/BarChart';
import ProgressCircle from '../../components/ProgressCircle';
import GeographyChart from '../../components/GeographyChart';
import { mockTransactions } from '../../data/mockData';
import { useState, useEffect, useRef } from 'react';
import { keyframes } from '@mui/system';

// Define keyframes for hover animation
const buttonHoverAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const Dashboard = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [scrolled, setScrolled] = useState(false);
   const dashboardRef = useRef(null);
   const headerHeight = 64; // Parent header height
   const headerRef = useRef(null);
   const [headerWidth, setHeaderWidth] = useState(0);

   // Handle scroll event to set fixed header
   useEffect(() => {
      const handleScroll = () => {
         if (!dashboardRef.current) return;

         const scrollPosition = window.scrollY;
         const dashboardOffset =
            dashboardRef.current.getBoundingClientRect().top + scrollPosition;

         if (scrollPosition > dashboardOffset - headerHeight) {
            setScrolled(true);
         } else {
            setScrolled(false);
         }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, [headerHeight]);

   // Calculate header width on mount and window resize
   useEffect(() => {
      if (headerRef.current) {
         setHeaderWidth(headerRef.current.offsetWidth);
      }

      const handleResize = () => {
         if (headerRef.current) {
            setHeaderWidth(headerRef.current.offsetWidth);
         }
      };

      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);

   return (
      <Box ref={dashboardRef} sx={{ position: 'relative' }}>
         {/* HEADER - Modified for fixed positioning */}
         <Box
            ref={headerRef}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
               position: scrolled ? 'fixed' : 'relative',
               top: scrolled ? headerHeight : 'auto',
               zIndex: 100,
               backgroundColor: colors.primary[400],
               padding: '15px 20px',
               marginBottom: '40px',
               boxShadow: scrolled
                  ? '0px 2px 10px rgba(0, 0, 0, 0.15)'
                  : 'none',
               transition: 'all 0.3s ease',
               width: scrolled ? headerWidth - 40 : '100%', // Subtract padding
               borderRadius: '4px 4px 0 0',
            }}
         >
            <Box>
               <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={colors.grey[100]}
                  sx={{ mb: '5px' }}
               >
                  DASHBOARD
               </Typography>
               <Typography variant="h7" color={colors.greenAccent[400]}>
                  Welcome to your farmer dashboard
               </Typography>
            </Box>
            <Button
               sx={{
                  backgroundColor: colors.greenAccent[600],
                  color: colors.grey[100],
                  fontSize: '14px',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  '&:hover': {
                     backgroundColor: colors.greenAccent[700],
                     animation: `${buttonHoverAnimation} 0.3s ease-in-out`,
                  },
               }}
            >
               <DownloadOutlinedIcon sx={{ mr: '10px' }} />
               Download Reports
            </Button>
         </Box>h

         {/* Add padding top when header is fixed to prevent content jump */}
         <Box sx={{ paddingTop: scrolled ? '80px' : 0 }}>
            {/* GRID & CHARTS */}
            <Box
               display="grid"
               gridTemplateColumns="repeat(12, 1fr)"
               gridAutoRows="140px"
               gap="40px"
               sx={{ mt: 2 }}
            >
               {/* ROW 1 */}
               <Box
                  gridColumn="span 3"
                  backgroundColor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                     transition: 'transform 0.3s ease',
                     '&:hover': {
                        transform: 'scale(1.05)',
                     },
                  }}
               >
                  <StatBox
                     title="5"
                     subtitle="Active Projects"
                     progress="0.75"
                     increase="+14%"
                     icon={
                        <AgricultureIcon
                           sx={{
                              color: colors.greenAccent[600],
                              fontSize: '26px',
                           }}
                        />
                     }
                  />
               </Box>
               <Box
                  gridColumn="span 3"
                  backgroundColor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                     transition: 'transform 0.3s ease',
                     '&:hover': {
                        transform: 'scale(1.05)',
                     },
                  }}
               >
                  <StatBox
                     title="2,500,000"
                     subtitle="Total Funding (FCFA)"
                     progress="0.50"
                     increase="+21%"
                     icon={
                        <MonetizationOnIcon
                           sx={{
                              color: colors.greenAccent[600],
                              fontSize: '26px',
                           }}
                        />
                     }
                  />
               </Box>
               <Box
                  gridColumn="span 3"
                  backgroundColor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                     transition: 'transform 0.3s ease',
                     '&:hover': {
                        transform: 'scale(1.05)',
                     },
                  }}
               >
                  <StatBox
                     title="2"
                     subtitle="Active Funding Cycles"
                     progress="0.30"
                     increase="+8%"
                     icon={
                        <MonetizationOnIcon
                           sx={{
                              color: colors.greenAccent[600],
                              fontSize: '26px',
                           }}
                        />
                     }
                  />
               </Box>
               <Box
                  gridColumn="span 3"
                  backgroundColor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                     transition: 'transform 0.3s ease',
                     '&:hover': {
                        transform: 'scale(1.05)',
                     },
                  }}
               >
                  <StatBox
                     title="1,200"
                     subtitle="User Engagements"
                     progress="0.80"
                     increase="+36%"
                     icon={
                        <DownloadOutlinedIcon
                           sx={{
                              color: colors.greenAccent[600],
                              fontSize: '26px',
                           }}
                        />
                     }
                  />
               </Box>

               {/* ROW 2 */}
               <Box
                  gridColumn="span 8"
                  gridRow="span 2"
                  backgroundColor={colors.primary[400]}
               >
                  <Box
                     mt="25px"
                     p="0 30px"
                     display="flex"
                     justifyContent="space-between"
                     alignItems="center"
                  >
                     <Box>
                        <Typography
                           variant="h5"
                           fontWeight="600"
                           color={colors.grey[100]}
                        >
                           Project Progress
                        </Typography>
                        <Typography
                           variant="h3"
                           fontWeight="bold"
                           color={colors.greenAccent[500]}
                        >
                           65% Complete
                        </Typography>
                     </Box>
                     <IconButton>
                        <DownloadOutlinedIcon
                           sx={{
                              fontSize: '26px',
                              color: colors.greenAccent[500],
                           }}
                        />
                     </IconButton>
                  </Box>
                  <Box height="250px" m="-20px 0 0 0">
                     <LineChart isDashboard={true} />
                  </Box>
               </Box>

               <Box
                  gridColumn="span 4"
                  gridRow="span 2"
                  backgroundColor={colors.primary[400]}
                  overflow="hidden" // Prevent content overflow
                  display="flex"
                  flexDirection="column"
               >
                  <Box
                     display="flex"
                     justifyContent="space-between"
                     alignItems="center"
                     borderBottom={`4px solid ${colors.primary[500]}`}
                     p="15px"
                  >
                     <Typography
                        color={colors.grey[100]}
                        variant="h5"
                        fontWeight="600"
                     >
                        Recent Transactions
                     </Typography>
                  </Box>
                  <Box
                     sx={{
                        overflowY: 'auto', // Enable vertical scrolling
                        maxHeight: 'calc(100% - 60px)', // Adjust height to fit within the box
                        padding: '10px',
                     }}
                  >
                     {mockTransactions.map((transaction, i) => (
                        <Box
                           key={`${transaction.txId}-${i}`}
                           display="flex"
                           justifyContent="space-between"
                           alignItems="center"
                           borderBottom={`4px solid ${colors.primary[500]}`}
                           p="15px"
                        >
                           <Box>
                              <Typography
                                 color={colors.greenAccent[500]}
                                 variant="h5"
                                 fontWeight="600"
                              >
                                 {transaction.txId}
                              </Typography>
                              <Typography color={colors.grey[100]}>
                                 {transaction.project}
                              </Typography>
                           </Box>
                           <Box color={colors.grey[100]}>
                              {transaction.date}
                           </Box>
                           <Box
                              sx={{
                                 backgroundColor: colors.greenAccent[500],
                                 p: '5px 10px',
                                 borderRadius: '4px',
                                 cursor: 'pointer', // Make it clickable
                                 transition:
                                    'transform 0.3s ease, background-color 0.3s ease',
                                 '&:hover': {
                                    backgroundColor: colors.greenAccent[600],
                                    transform: 'scale(1.05)', // Add scaling effect on hover
                                 },
                              }}
                           >
                              FCFA {transaction.amount.toLocaleString()}
                           </Box>
                        </Box>
                     ))}
                  </Box>
               </Box>

               {/* ROW 3 */}
               <Box
                  gridColumn="span 4"
                  gridRow="span 2"
                  backgroundColor={colors.primary[400]}
                  p="30px"
               >
                  <Typography variant="h5" fontWeight="600" mb={2}>
                     Funding Progress
                  </Typography>
                  <Box
                     display="flex"
                     flexDirection="column"
                     alignItems="center"
                     mt="25px"
                  >
                     <ProgressCircle size="125" />
                     <Typography
                        variant="h5"
                        color={colors.greenAccent[500]}
                        sx={{ mt: '15px' }}
                     >
                        75% Funded
                     </Typography>
                     <Typography>Current funding round</Typography>
                  </Box>
               </Box>

               <Box
                  gridColumn="span 4"
                  gridRow="span 2"
                  backgroundColor={colors.primary[400]}
               >
                  <Typography
                     variant="h5"
                     fontWeight="600"
                     sx={{ padding: '30px 30px 0 30px' }}
                  >
                     Sales Quantity
                  </Typography>
                  <Box height="250px" mt="-20px">
                     <BarChart isDashboard={true} />
                  </Box>
               </Box>

               <Box
                  gridColumn="span 4"
                  gridRow="span 2"
                  backgroundColor={colors.primary[400]}
                  p="30px"
               >
                  <Typography variant="h5" fontWeight="600" mb={2}>
                     Geography Based Traffic
                  </Typography>
                  <Box height="200px">
                     <GeographyChart isDashboard={true} />
                  </Box>
               </Box>
            </Box>
         </Box>
      </Box>
   );
};

export default Dashboard;
