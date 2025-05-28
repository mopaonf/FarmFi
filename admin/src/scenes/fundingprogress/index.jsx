import React, { useState, useEffect } from 'react';
import {
   Box,
   Typography,
   Select,
   MenuItem,
   TextField,
   Button,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   CircularProgress,
   useTheme,
} from '@mui/material';
import { tokens } from '../../theme';
// Remove mockData imports
import { ResponsivePie } from '@nivo/pie';
import axios from 'axios';

const FundingProgressPage = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [farmers, setFarmers] = useState([]);
   const [projects, setProjects] = useState([]);
   const [selectedFarmer, setSelectedFarmer] = useState('');
   const [selectedProject, setSelectedProject] = useState('');
   const [disbursementAmount, setDisbursementAmount] = useState('');
   const [isDisbursing, setIsDisbursing] = useState(false);
   const [disbursementHistory, setDisbursementHistory] = useState([]);
   const [loading, setLoading] = useState(true);

   // Add state for totalInvestment and disbursementHistory fetched from backend
   const [totalInvestment, setTotalInvestment] = useState(0);
   const [projectDisbursementHistory, setProjectDisbursementHistory] = useState(
      []
   );
   const [farmerTotalInvestment, setFarmerTotalInvestment] = useState(0);

   // Fetch farmers from backend on mount
   useEffect(() => {
      const fetchFarmers = async () => {
         try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('http://localhost:5000/api/farmers', {
               headers: { Authorization: `Bearer ${token}` },
            });
            setFarmers(res.data);
         } catch (err) {
            setFarmers([]);
         }
      };
      fetchFarmers();
   }, []);

   // Fetch projects for selected farmer from backend
   useEffect(() => {
      if (!selectedFarmer) {
         setProjects([]);
         setSelectedProject('');
         return;
      }
      const fetchProjects = async () => {
         try {
            const token = localStorage.getItem('adminToken');
            // Only fetch projects created by the selected farmer
            const res = await axios.get(
               `http://localhost:5000/api/projects?farmer=${selectedFarmer}`,
               { headers: { Authorization: `Bearer ${token}` } }
            );
            setProjects(res.data);
         } catch (err) {
            setProjects([]);
         }
      };
      fetchProjects();
   }, [selectedFarmer]);

   // Fetch total investment and disbursement history for selected project
   useEffect(() => {
      if (!selectedProject) {
         setTotalInvestment(0);
         setProjectDisbursementHistory([]);
         return;
      }
      const fetchProjectStats = async () => {
         try {
            const token = localStorage.getItem('adminToken');
            // Backend endpoint should return { totalInvestment, disbursementHistory }
            const res = await axios.get(
               `http://localhost:5000/api/projects/${selectedProject}/funding-progress`,
               { headers: { Authorization: `Bearer ${token}` } }
            );
            setTotalInvestment(res.data.totalInvestment || 0);
            setProjectDisbursementHistory(res.data.disbursementHistory || []);
         } catch (err) {
            setTotalInvestment(0);
            setProjectDisbursementHistory([]);
         }
      };
      fetchProjectStats();
   }, [selectedProject]);

   // Fetch total investment for all projects of selected farmer
   useEffect(() => {
      if (!selectedFarmer) {
         setFarmerTotalInvestment(0);
         return;
      }
      const fetchFarmerTotalInvestment = async () => {
         try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(
               `http://localhost:5000/api/projects/farmer/${selectedFarmer}/total-investment`,
               { headers: { Authorization: `Bearer ${token}` } }
            );
            setFarmerTotalInvestment(res.data.totalInvestment || 0);
         } catch (err) {
            setFarmerTotalInvestment(0);
         }
      };
      fetchFarmerTotalInvestment();
   }, [selectedFarmer]);

   // Handle farmer selection
   const handleFarmerChange = (event) => {
      setSelectedFarmer(event.target.value);
      setSelectedProject('');
   };

   // Handle project selection
   const handleProjectChange = (event) => {
      setSelectedProject(event.target.value);
   };

   // Handle disbursement
   const handleDisbursement = async () => {
      if (!disbursementAmount || disbursementAmount <= 0) {
         alert('Please enter a valid disbursement amount.');
         return;
      }
      if (!selectedFarmer || !selectedProject) {
         alert('Please select a farmer and project.');
         return;
      }

      setIsDisbursing(true);

      try {
         const token = localStorage.getItem('adminToken');
         const res = await axios.post(
            'http://localhost:5000/api/wallets/admin-disburse-farmer',
            {
               farmerId: selectedFarmer,
               projectId: selectedProject,
               amount: Number(disbursementAmount),
               description: `Disbursement for project ${selectedProject}`,
            },
            {
               headers: { Authorization: `Bearer ${token}` },
            }
         );
         // Optionally update disbursement history here by refetching or pushing new record
         setDisbursementHistory((prev) => [
            ...prev,
            {
               id: `DSB${Date.now()}`,
               project: selectedProject,
               amount: Number(disbursementAmount),
               date: new Date().toLocaleDateString(),
            },
         ]);
         setDisbursementAmount('');
         alert('Disbursement successful!');
      } catch (err) {
         alert(
            err.response?.data?.message ||
               err.response?.data?.error ||
               'Disbursement failed'
         );
      } finally {
         setIsDisbursing(false);
      }
   };

   // Get selected project details (move this above pieData definition)
   const selectedProjectDetails = projects.find(
      (project) => project._id === selectedProject
   );

   // Pie chart data using real totalInvestment and funding goal
   const pieData = [
      {
         id: 'Invested',
         value: totalInvestment,
         color: colors.greenAccent[400],
      },
      {
         id: 'Remaining Goal',
         value:
            (selectedProjectDetails?.funding_goal || 0) - totalInvestment > 0
               ? (selectedProjectDetails?.funding_goal || 0) - totalInvestment
               : 0,
         color: colors.redAccent[400],
      },
   ];

   // Get selected farmer details
   const selectedFarmerDetails = farmers.find(
      (farmer) => farmer._id === selectedFarmer
   );

   // Filter projects for selected farmer
   const filteredProjects = projects.filter(
      (project) => project.farmer?._id === selectedFarmer
   );

   return (
      <Box m="20px" display="flex" gap="20px">
         {/* Left Column: Farmer Details */}
         <Box
            flex="1"
            p="20px"
            bgcolor={colors.primary[400]}
            borderRadius="8px"
         >
            <Typography
               variant="h5"
               fontWeight="bold"
               color={colors.grey[100]}
               mb={2}
            >
               Farmer Details
            </Typography>
            <Select
               value={selectedFarmer}
               onChange={handleFarmerChange}
               displayEmpty
               fullWidth
               sx={{
                  backgroundColor: colors.primary[300],
                  borderRadius: '8px',
                  color: colors.grey[100],
                  mb: 3,
               }}
            >
               <MenuItem value="" disabled>
                  Select a Farmer
               </MenuItem>
               {farmers.map((farmer) => (
                  <MenuItem key={farmer._id} value={farmer._id}>
                     {farmer.name}
                  </MenuItem>
               ))}
            </Select>

            {selectedFarmerDetails && (
               <>
                  <Typography variant="body1" color={colors.grey[100]} mb={1}>
                     <strong>Name:</strong> {selectedFarmerDetails.name}
                  </Typography>
                  <Typography variant="body1" color={colors.grey[100]} mb={1}>
                     <strong>Email:</strong> {selectedFarmerDetails.email}
                  </Typography>
                  <Typography variant="body1" color={colors.grey[100]} mb={1}>
                     <strong>Phone:</strong> {selectedFarmerDetails.phone}
                  </Typography>
                  <Typography variant="body1" color={colors.grey[100]} mb={1}>
                     <strong>Address:</strong> {selectedFarmerDetails.address}
                  </Typography>
                  <Typography variant="body1" color={colors.grey[100]} mb={1}>
                     <strong>Zip Code:</strong> {selectedFarmerDetails.zipCode}
                  </Typography>

                  {/* Statistical Data */}
                  <Box mt={4}>
                     <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={colors.greenAccent[400]}
                        mb={2}
                     >
                        Farmer Statistics
                     </Typography>
                     <Box
                        display="grid"
                        gridTemplateColumns="repeat(2, 1fr)"
                        gap={2}
                     >
                        <Box
                           bgcolor={colors.primary[300]}
                           p={2}
                           borderRadius="8px"
                           textAlign="center"
                        >
                           <Typography
                              variant="h6"
                              fontWeight="bold"
                              color={colors.greenAccent[400]}
                           >
                              Total Projects
                           </Typography>
                           <Typography
                              variant="h4"
                              fontWeight="bold"
                              color={colors.grey[100]}
                           >
                              {filteredProjects.length}
                           </Typography>
                        </Box>
                        <Box
                           bgcolor={colors.primary[300]}
                           p={2}
                           borderRadius="8px"
                           textAlign="center"
                        >
                           <Typography
                              variant="h6"
                              fontWeight="bold"
                              color={colors.greenAccent[400]}
                           >
                              Total Investments
                           </Typography>
                           <Typography
                              variant="h4"
                              fontWeight="bold"
                              color={colors.grey[100]}
                           >
                              FCFA {farmerTotalInvestment.toLocaleString()}
                           </Typography>
                        </Box>
                        <Box
                           bgcolor={colors.primary[300]}
                           p={2}
                           borderRadius="8px"
                           textAlign="center"
                        >
                           <Typography
                              variant="h6"
                              fontWeight="bold"
                              color={colors.greenAccent[400]}
                           >
                              Completed Projects
                           </Typography>
                           <Typography
                              variant="h4"
                              fontWeight="bold"
                              color={colors.grey[100]}
                           >
                              {
                                 filteredProjects.filter(
                                    (project) => project.status === 'completed'
                                 ).length
                              }
                           </Typography>
                        </Box>
                        <Box
                           bgcolor={colors.primary[300]}
                           p={2}
                           borderRadius="8px"
                           textAlign="center"
                        >
                           <Typography
                              variant="h6"
                              fontWeight="bold"
                              color={colors.greenAccent[400]}
                           >
                              Pending Projects
                           </Typography>
                           <Typography
                              variant="h4"
                              fontWeight="bold"
                              color={colors.grey[100]}
                           >
                              {
                                 filteredProjects.filter(
                                    (project) => project.status === 'submitted'
                                 ).length
                              }
                           </Typography>
                        </Box>
                     </Box>
                  </Box>
               </>
            )}
         </Box>

         {/* Right Column: Project Details */}
         <Box
            flex="2"
            p="20px"
            bgcolor={colors.primary[400]}
            borderRadius="8px"
         >
            <Typography
               variant="h5"
               fontWeight="bold"
               color={colors.grey[100]}
               mb={2}
            >
               Project Details
            </Typography>
            <Select
               value={selectedProject}
               onChange={(e) => setSelectedProject(e.target.value)}
               displayEmpty
               fullWidth
               sx={{
                  backgroundColor: colors.primary[300],
                  borderRadius: '8px',
                  color: colors.grey[100],
                  mb: 3,
               }}
               disabled={!selectedFarmer}
            >
               <MenuItem value="" disabled>
                  Select a Project
               </MenuItem>
               {/* Only show projects created by the selected farmer */}
               {projects
                  .filter((project) => project.farmer?._id === selectedFarmer)
                  .map((project) => (
                     <MenuItem key={project._id} value={project._id}>
                        {project.title}
                     </MenuItem>
                  ))}
            </Select>

            {selectedProjectDetails && (
               <>
                  <Typography variant="body1" color={colors.grey[100]} mb={1}>
                     <strong>Title:</strong> {selectedProjectDetails.title}
                  </Typography>
                  <Typography variant="body1" color={colors.grey[100]} mb={1}>
                     <strong>Status:</strong> {selectedProjectDetails.status}
                  </Typography>
                  <Typography variant="body1" color={colors.grey[100]} mb={1}>
                     <strong>Funding Goal:</strong> FCFA{' '}
                     {selectedProjectDetails.funding_goal?.toLocaleString() ||
                        'N/A'}
                  </Typography>

                  <Box
                     mb={4}
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                  >
                     <Box>
                        <Typography
                           variant="body1"
                           color={colors.grey[100]}
                           mb={1}
                           align="center"
                        >
                           <strong>Total Investment:</strong> FCFA{' '}
                           {totalInvestment.toLocaleString()}
                        </Typography>
                        <Box
                           width={{ xs: '100%', sm: 400, md: 500 }}
                           height={{ xs: 350, sm: 400, md: 450 }}
                           display="flex"
                           justifyContent="center"
                           alignItems="center"
                           mx="auto"
                        >
                           <ResponsivePie
                              data={pieData}
                              margin={{
                                 top: 40,
                                 right: 80,
                                 bottom: 80,
                                 left: 80,
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
                     </Box>
                  </Box>

                  {/* Disbursement Section */}
                  <Box mb={4}>
                     <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={colors.greenAccent[400]}
                        mb={2}
                     >
                        Disbursement
                     </Typography>
                     <Box display="flex" gap={2} alignItems="center">
                        <TextField
                           type="number"
                           label="Amount (FCFA)"
                           value={disbursementAmount}
                           onChange={(e) =>
                              setDisbursementAmount(e.target.value)
                           }
                           sx={{
                              backgroundColor: colors.primary[300],
                              borderRadius: '8px',
                              color: colors.grey[100],
                              flex: 1,
                           }}
                        />
                        <Button
                           variant="contained"
                           color="success"
                           onClick={handleDisbursement}
                           disabled={isDisbursing}
                        >
                           {isDisbursing ? (
                              <CircularProgress size={20} color="inherit" />
                           ) : (
                              'Disburse'
                           )}
                        </Button>
                     </Box>
                  </Box>

                  {/* Disbursement History */}
                  <Box>
                     <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={colors.greenAccent[400]}
                        mb={2}
                     >
                        Disbursement History
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
                                    ID
                                 </TableCell>
                                 <TableCell sx={{ color: colors.grey[100] }}>
                                    Project
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
                              {projectDisbursementHistory.map(
                                 (disbursement) => (
                                    <TableRow key={disbursement.id}>
                                       <TableCell
                                          sx={{ color: colors.grey[300] }}
                                       >
                                          {disbursement.id}
                                       </TableCell>
                                       <TableCell
                                          sx={{ color: colors.grey[300] }}
                                       >
                                          {disbursement.projectTitle ||
                                             selectedProjectDetails?.title}
                                       </TableCell>
                                       <TableCell
                                          sx={{ color: colors.grey[300] }}
                                       >
                                          {disbursement.amount.toLocaleString()}
                                       </TableCell>
                                       <TableCell
                                          sx={{ color: colors.grey[300] }}
                                       >
                                          {disbursement.date}
                                       </TableCell>
                                    </TableRow>
                                 )
                              )}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  </Box>
               </>
            )}
         </Box>
      </Box>
   );
};

export default FundingProgressPage;
