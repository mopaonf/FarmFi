import React, { useState, useEffect } from 'react';
import {
   Box,
   Typography,
   Select,
   MenuItem,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   CircularProgress,
   useTheme,
   Button,
} from '@mui/material';
import { tokens } from '../../theme';
import { ResponsivePie } from '@nivo/pie';
import axios from 'axios';

const ContributorsPage = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [projects, setProjects] = useState([]);
   const [selectedProject, setSelectedProject] = useState('');
   const [projectDetails, setProjectDetails] = useState(null);
   const [investorSummary, setInvestorSummary] = useState([]);
   const [loading, setLoading] = useState(true);
   const [releaseLoading, setReleaseLoading] = useState(false);
   const [releaseSuccess, setReleaseSuccess] = useState('');
   const [releaseError, setReleaseError] = useState('');
   const [profitReleaseHistory, setProfitReleaseHistory] = useState([]);
   const [profitReleaseTotal, setProfitReleaseTotal] = useState(0);

   // Fetch completed projects on mount
   useEffect(() => {
      const fetchProjects = async () => {
         setLoading(true);
         try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(
               'http://localhost:5000/api/projects?status=completed',
               { headers: { Authorization: `Bearer ${token}` } }
            );
            setProjects(res.data);
         } catch (err) {
            setProjects([]);
         }
         setLoading(false);
      };
      fetchProjects();
   }, []);

   // Fetch project details and investor summary when a project is selected
   useEffect(() => {
      if (!selectedProject) {
         setProjectDetails(null);
         setInvestorSummary([]);
         return;
      }
      const fetchProjectDetailsAndInvestors = async () => {
         setLoading(true);
         try {
            const token = localStorage.getItem('adminToken');
            // Get project details (including totalProfit)
            const res = await axios.get(
               `http://localhost:5000/api/projects/${selectedProject}`,
               { headers: { Authorization: `Bearer ${token}` } }
            );
            setProjectDetails(res.data);

            // Get all investments for this project, grouped by investor
            const invRes = await axios.get(
               `http://localhost:5000/api/investments?project=${selectedProject}`,
               { headers: { Authorization: `Bearer ${token}` } }
            );
            // Use the summary array from backend response
            setInvestorSummary(invRes.data.summary || []);
         } catch (err) {
            setProjectDetails(null);
            setInvestorSummary([]);
         }
         setLoading(false);
      };
      fetchProjectDetailsAndInvestors();
   }, [selectedProject]);

   // Fetch profit release history for the selected project
   useEffect(() => {
      if (!selectedProject) {
         setProfitReleaseHistory([]);
         setProfitReleaseTotal(0);
         return;
      }
      const fetchProfitReleaseHistory = async () => {
         try {
            const token = localStorage.getItem('adminToken');
            // Backend endpoint should return an array of profit releases for this project
            const res = await axios.get(
               `http://localhost:5000/api/projects/${selectedProject}/profit-releases`,
               { headers: { Authorization: `Bearer ${token}` } }
            );
            setProfitReleaseHistory(res.data.history || []);
            setProfitReleaseTotal(res.data.total || 0);
         } catch (err) {
            setProfitReleaseHistory([]);
            setProfitReleaseTotal(0);
         }
      };
      fetchProfitReleaseHistory();
   }, [selectedProject, releaseSuccess]);

   // Pie chart data for profit (received vs. remaining)
   const pieData = projectDetails
      ? [
           {
              id: 'Profit Received',
              value: projectDetails.totalProfit || 0,
              color: colors.greenAccent[400],
           },
           {
              id: 'Remaining Goal',
              value: (() => {
                 // Extract the first number from annual_net_profit_estimate
                 let estimate = 0;
                 if (projectDetails.annual_net_profit_estimate) {
                    // Match the first number (ignore commas, spaces, FCFA, etc.)
                    const match = String(
                       projectDetails.annual_net_profit_estimate
                    )
                       .replace(/,/g, '')
                       .match(/(\d+)/);
                    if (match) {
                       estimate = Number(match[1]);
                    }
                 }
                 const remaining =
                    estimate - (projectDetails.totalProfit || 0) > 0
                       ? estimate - (projectDetails.totalProfit || 0)
                       : 0;
                 return remaining;
              })(),
              color: colors.redAccent[400],
           },
        ]
      : [];

   // Handler to release profit to investors
   const handleReleaseProfit = async () => {
      if (!selectedProject) return;
      setReleaseLoading(true);
      setReleaseSuccess('');
      setReleaseError('');
      try {
         const token = localStorage.getItem('adminToken');
         // Backend endpoint should distribute profit to investors and create transactions
         await axios.post(
            `http://localhost:5000/api/projects/${selectedProject}/release-profit`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
         );
         setReleaseSuccess('Profit released to investors successfully.');
         // Optionally, refetch project details and investor summary to update UI
         // (You may want to refetch here)
      } catch (err) {
         setReleaseError(
            err?.response?.data?.message ||
               err?.response?.data?.error ||
               'Failed to release profit.'
         );
      }
      setReleaseLoading(false);
   };

   return (
      <Box m="20px">
         <Typography
            variant="h4"
            fontWeight="bold"
            color={colors.grey[100]}
            mb={2}
         >
            Contributors & Profit Overview
         </Typography>
         <Box mb={4}>
            <Select
               value={selectedProject}
               onChange={(e) => setSelectedProject(e.target.value)}
               displayEmpty
               fullWidth
               sx={{
                  backgroundColor: colors.primary[300],
                  borderRadius: '8px',
                  color: colors.grey[100],
                  mb: 2,
               }}
            >
               <MenuItem value="" disabled>
                  Select a Completed Project
               </MenuItem>
               {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                     {project.title}
                  </MenuItem>
               ))}
            </Select>
         </Box>
         {loading && (
            <Box display="flex" justifyContent="center" m={4}>
               <CircularProgress />
            </Box>
         )}
         {projectDetails && (
            <Box>
               <Typography
                  variant="h6"
                  color={colors.greenAccent[400]}
                  mb={2}
                  fontWeight="bold"
               >
                  Project: {projectDetails.title}
               </Typography>
               <Box display="flex" gap={4} flexWrap="wrap" mb={4}>
                  <Box>
                     <Typography
                        variant="body1"
                        color={colors.grey[100]}
                        mb={1}
                     >
                        <strong>Total Profit Received:</strong> FCFA{' '}
                        {Number(
                           projectDetails.totalProfit || 0
                        ).toLocaleString()}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey[100]}
                        mb={1}
                     >
                        <strong>Number of Investors:</strong>{' '}
                        {investorSummary.length}
                     </Typography>
                  </Box>
                  <Box width={300} height={300}>
                     <ResponsivePie
                        data={pieData}
                        margin={{
                           top: 40,
                           right: 40,
                           bottom: 40,
                           left: 40,
                        }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        colors={{ datum: 'data.color' }}
                        borderWidth={1}
                        borderColor={{
                           from: 'color',
                           modifiers: [['darker', 0.2]],
                        }}
                        radialLabelsSkipAngle={10}
                        radialLabelsTextColor={colors.grey[100]}
                        radialLabelsLinkColor={colors.grey[100]}
                        sliceLabelsSkipAngle={10}
                        sliceLabelsTextColor={colors.grey[100]}
                     />
                  </Box>
                  {/* --- NEW: Profit Release History Table --- */}
                  <Box flex={1} minWidth={320}>
                     <Typography
                        variant="h6"
                        color={colors.greenAccent[400]}
                        fontWeight="bold"
                        mb={2}
                     >
                        Profit Release History
                     </Typography>
                     <TableContainer
                        component={Paper}
                        sx={{
                           backgroundColor: colors.primary[300],
                           borderRadius: '8px',
                           mb: 2,
                        }}
                     >
                        <Table size="small">
                           <TableHead>
                              <TableRow>
                                 <TableCell sx={{ color: colors.grey[100] }}>
                                    #
                                 </TableCell>
                                 <TableCell sx={{ color: colors.grey[100] }}>
                                    Amount (FCFA)
                                 </TableCell>
                                 <TableCell sx={{ color: colors.grey[100] }}>
                                    Date
                                 </TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {profitReleaseHistory.length === 0 && (
                                 <TableRow>
                                    <TableCell
                                       colSpan={3}
                                       sx={{
                                          color: colors.grey[400],
                                          textAlign: 'center',
                                       }}
                                    >
                                       No profit releases yet.
                                    </TableCell>
                                 </TableRow>
                              )}
                              {profitReleaseHistory.map((release, idx) => (
                                 <TableRow key={idx}>
                                    <TableCell sx={{ color: colors.grey[300] }}>
                                       {idx + 1}
                                    </TableCell>
                                    <TableCell sx={{ color: colors.grey[300] }}>
                                       {Number(release.amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ color: colors.grey[300] }}>
                                       {release.date
                                          ? new Date(
                                               release.date
                                            ).toLocaleString()
                                          : ''}
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>
                     <Typography
                        variant="body1"
                        color={colors.greenAccent[400]}
                        fontWeight="bold"
                        mt={1}
                     >
                        Total Released: FCFA{' '}
                        {Number(profitReleaseTotal).toLocaleString()}
                     </Typography>
                  </Box>
               </Box>
               {/* Release Profit Section */}
               <Box mb={4}>
                  <Typography
                     variant="h6"
                     color={colors.greenAccent[400]}
                     fontWeight="bold"
                     mb={2}
                  >
                     Release Profit to Investors
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                     <Button
                        variant="contained"
                        color="success"
                        onClick={handleReleaseProfit}
                        disabled={releaseLoading || !selectedProject}
                     >
                        {releaseLoading ? 'Releasing...' : 'Release Profit'}
                     </Button>
                     {releaseSuccess && (
                        <Typography color={colors.greenAccent[400]}>
                           {releaseSuccess}
                        </Typography>
                     )}
                     {releaseError && (
                        <Typography color={colors.redAccent[400]}>
                           {releaseError}
                        </Typography>
                     )}
                  </Box>
                  <Typography variant="body2" color={colors.grey[400]} mt={1}>
                     This will credit all eligible investors' wallets and record
                     the transactions.
                  </Typography>
               </Box>
               <Typography
                  variant="h6"
                  color={colors.greenAccent[400]}
                  mb={2}
                  fontWeight="bold"
               >
                  Investors & Their Investments
               </Typography>
               <TableContainer
                  component={Paper}
                  sx={{
                     backgroundColor: colors.primary[300],
                     borderRadius: '8px',
                  }}
               >
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell sx={{ color: colors.grey[100] }}>
                              Investor Name
                           </TableCell>
                           <TableCell sx={{ color: colors.grey[100] }}>
                              Email
                           </TableCell>
                           <TableCell sx={{ color: colors.grey[100] }}>
                              Number of Units
                           </TableCell>
                           <TableCell sx={{ color: colors.grey[100] }}>
                              Total Amount Invested (FCFA)
                           </TableCell>
                           <TableCell sx={{ color: colors.grey[100] }}>
                              Profit To Be Released (FCFA)
                           </TableCell>
                           <TableCell sx={{ color: colors.grey[100] }}>
                              ROI (%)
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {investorSummary.map((inv, idx) => {
                           // Calculate profit per unit and investor profit
                           const totalProfit = Number(
                              projectDetails?.totalProfit || 0
                           );
                           const totalUnits = Number(
                              projectDetails?.totalUnits || 0
                           );
                           const unitPrice = Number(
                              projectDetails?.unitPrice || 0
                           );
                           const investorUnits = Number(inv.totalUnits || 0);
                           const profitPerUnit =
                              totalUnits > 0 ? totalProfit / totalUnits : 0;
                           const investorProfit = profitPerUnit * investorUnits;
                           const roi =
                              unitPrice > 0
                                 ? ((profitPerUnit / unitPrice) * 100).toFixed(
                                      2
                                   )
                                 : 'N/A';
                           return (
                              <TableRow key={idx}>
                                 <TableCell sx={{ color: colors.grey[300] }}>
                                    {inv.investor?.name ||
                                       inv.investor ||
                                       'N/A'}
                                 </TableCell>
                                 <TableCell sx={{ color: colors.grey[300] }}>
                                    {inv.investor?.email || 'N/A'}
                                 </TableCell>
                                 <TableCell sx={{ color: colors.grey[300] }}>
                                    {inv.totalUnits}
                                 </TableCell>
                                 <TableCell sx={{ color: colors.grey[300] }}>
                                    {Number(inv.totalAmount).toLocaleString()}
                                 </TableCell>
                                 <TableCell sx={{ color: colors.grey[300] }}>
                                    {investorProfit.toLocaleString(undefined, {
                                       maximumFractionDigits: 0,
                                    })}
                                 </TableCell>
                                 <TableCell sx={{ color: colors.grey[300] }}>
                                    {roi !== 'N/A' ? `${roi}%` : 'N/A'}
                                 </TableCell>
                              </TableRow>
                           );
                        })}
                     </TableBody>
                  </Table>
               </TableContainer>
            </Box>
         )}
      </Box>
   );
};

export default ContributorsPage;
