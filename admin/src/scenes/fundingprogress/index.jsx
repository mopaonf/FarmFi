import React, { useState } from 'react';
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
   Divider,
} from '@mui/material';
import { tokens } from '../../theme';
import {
   projects,
   mockTransactions,
   mockDataContacts,
} from '../../data/mockData';
import { ResponsivePie } from '@nivo/pie';

const FundingProgressPage = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [selectedFarmer, setSelectedFarmer] = useState('');
   const [selectedProject, setSelectedProject] = useState('');
   const [disbursementAmount, setDisbursementAmount] = useState('');
   const [isDisbursing, setIsDisbursing] = useState(false);
   const [disbursementHistory, setDisbursementHistory] = useState([]);

   // Handle farmer selection
   const handleFarmerChange = (event) => {
      setSelectedFarmer(event.target.value);
      setSelectedProject(''); // Reset project selection when farmer changes
   };

   // Handle project selection
   const handleProjectChange = (event) => {
      setSelectedProject(event.target.value);
   };

   // Calculate total investment for the selected project
   const totalInvestment = mockTransactions
      .filter((transaction) => transaction.project === selectedProject)
      .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

   // Handle disbursement
   const handleDisbursement = () => {
      if (!disbursementAmount || disbursementAmount <= 0) {
         alert('Please enter a valid disbursement amount.');
         return;
      }

      setIsDisbursing(true);

      // Simulate API call
      setTimeout(() => {
         setDisbursementHistory((prev) => [
            ...prev,
            {
               id: `DSB${Date.now()}`,
               project: selectedProject,
               amount: disbursementAmount,
               date: new Date().toLocaleDateString(),
            },
         ]);
         setDisbursementAmount('');
         setIsDisbursing(false);
         alert('Disbursement successful!');
      }, 1500);
   };

   // Pie chart data
   const pieData = [
      {
         id: 'Invested',
         value: totalInvestment,
         color: colors.greenAccent[400],
      },
      {
         id: 'Remaining Goal',
         value:
            projects.find((project) => project.title === selectedProject)
               ?.fundingGoal - totalInvestment || 0,
         color: colors.redAccent[400],
      },
   ];

   // Get selected farmer details
   const selectedFarmerDetails = mockDataContacts.find(
      (farmer) => farmer.id === parseInt(selectedFarmer) // Ensure IDs are compared as numbers
   );

   // Filter projects by selected farmer
   const filteredProjects = projects.filter(
      (project) => project.farmerId === selectedFarmerDetails?.id // Match farmerId with selected farmer's ID
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
               {mockDataContacts.map((farmer) => (
                  <MenuItem key={farmer.id} value={farmer.id}>
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
                     <strong>City:</strong> {selectedFarmerDetails.city}
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
                              FCFA{' '}
                              {mockTransactions
                                 .filter((transaction) =>
                                    filteredProjects.some(
                                       (project) =>
                                          project.title === transaction.project
                                    )
                                 )
                                 .reduce(
                                    (sum, transaction) =>
                                       sum + parseFloat(transaction.amount),
                                    0
                                 )
                                 .toLocaleString()}
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
                                    (project) => project.status === 'Completed'
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
                                    (project) => project.status === 'Submitted'
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
               onChange={handleProjectChange}
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
               {filteredProjects.map((project) => (
                  <MenuItem key={project.id} value={project.title}>
                     {project.title}
                  </MenuItem>
               ))}
            </Select>

            {selectedProject && (
               <>
                  <Box mb={4}>
                     <Typography
                        variant="body1"
                        color={colors.grey[100]}
                        mb={1}
                     >
                        <strong>Total Investment:</strong> FCFA{' '}
                        {totalInvestment.toLocaleString()}
                     </Typography>
                     <Box width="300px" height="300px">
                        <ResponsivePie
                           data={pieData}
                           margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
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
                              {disbursementHistory.map((disbursement) => (
                                 <TableRow key={disbursement.id}>
                                    <TableCell sx={{ color: colors.grey[300] }}>
                                       {disbursement.id}
                                    </TableCell>
                                    <TableCell sx={{ color: colors.grey[300] }}>
                                       {disbursement.project}
                                    </TableCell>
                                    <TableCell sx={{ color: colors.grey[300] }}>
                                       {disbursement.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ color: colors.grey[300] }}>
                                       {disbursement.date}
                                    </TableCell>
                                 </TableRow>
                              ))}
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
