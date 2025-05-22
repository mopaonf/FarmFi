import React, { useState, useEffect } from 'react';
import {
   Box,
   Typography,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   useTheme,
   IconButton,
   Tooltip,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   CircularProgress,
   Alert,
   Grid,
} from '@mui/material';
import { tokens } from '../../theme';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatDistanceToNow, format } from 'date-fns';

const InvestmentConfirmationPage = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [pendingInvestments, setPendingInvestments] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [selectedInvestment, setSelectedInvestment] = useState(null);
   const [confirmDialog, setConfirmDialog] = useState({
      open: false,
      action: null,
   });
   const [detailsModal, setDetailsModal] = useState({
      open: false,
      investment: null,
   });

   useEffect(() => {
      fetchPendingInvestments();
   }, []);

   const fetchPendingInvestments = async () => {
      const token = localStorage.getItem('adminToken'); // Change token key
      if (!token) {
         setError('Authentication token not found');
         window.location.href = '/login'; // Redirect to login
         return;
      }

      try {
         const response = await fetch(
            'http://localhost:5000/api/investments/pending',
            {
               method: 'GET',
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
               },
            }
         );

         if (response.status === 401) {
            localStorage.removeItem('adminToken'); // Clear invalid token
            localStorage.removeItem('adminData');
            window.location.href = '/login';
            return;
         }

         if (!response.ok) {
            throw new Error('Failed to fetch pending investments');
         }

         const data = await response.json();
         setPendingInvestments(data);
      } catch (error) {
         setError(error.message);
      } finally {
         setLoading(false);
      }
   };

   const handleConfirmClick = (investment) => {
      setSelectedInvestment(investment);
      setConfirmDialog({ open: true, action: 'confirm' });
   };

   const handleRejectClick = (investment) => {
      setSelectedInvestment(investment);
      setConfirmDialog({ open: true, action: 'reject' });
   };

   const handleConfirm = async (investmentId) => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
         window.location.href = '/login';
         return;
      }

      try {
         const response = await fetch(
            `http://localhost:5000/api/investments/confirm/${investmentId}`,
            {
               method: 'POST',
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
               },
            }
         );

         // Log the raw response for debugging
         const rawResponse = await response.text();
         console.log('Raw response:', rawResponse);

         if (response.status === 401) {
            setError('Session expired. Please login again.');
            return;
         }

         if (!response.ok) {
            try {
               const errorData = JSON.parse(rawResponse);
               throw new Error(
                  errorData.error || 'Failed to confirm investment'
               );
            } catch (e) {
               throw new Error('Server error: Could not confirm investment');
            }
         }

         const result = JSON.parse(rawResponse);
         console.log('Confirmation result:', result);

         await fetchPendingInvestments();
         setDetailsModal({ open: false, investment: null });
         setConfirmDialog({ open: false, action: null });
      } catch (error) {
         console.error('Confirmation error:', error);
         setError(error.message || 'Failed to confirm investment');
      }
   };

   const handleReject = async (investmentId) => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
         window.location.href = '/login';
         return;
      }

      try {
         const response = await fetch(
            `http://localhost:5000/api/investments/reject/${investmentId}`,
            {
               method: 'POST',
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
               },
            }
         );

         if (response.status === 401) {
            setError('Session expired. Please login again.');
            return;
         }

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to reject investment');
         }

         await fetchPendingInvestments();
         setConfirmDialog({ open: false, action: null });
      } catch (error) {
         setError(error.message);
      }
   };

   const handleViewDetails = (investment) => {
      setDetailsModal({ open: true, investment });
   };

   const formatDate = (date) => {
      try {
         return formatDistanceToNow(new Date(date), { addSuffix: true });
      } catch (error) {
         return format(new Date(date), 'PP'); // fallback to simple date format
      }
   };

   const calculateProgress = (project) => {
      if (
         !project ||
         typeof project.unitsInvested !== 'number' ||
         typeof project.totalUnits !== 'number'
      ) {
         return 0;
      }
      return ((project.unitsInvested / project.totalUnits) * 100).toFixed(1);
   };

   const calculateAvailableUnits = (project) => {
      if (
         !project ||
         typeof project.unitsInvested !== 'number' ||
         typeof project.totalUnits !== 'number'
      ) {
         return 0;
      }
      return project.totalUnits - project.unitsInvested;
   };

   if (loading) {
      return (
         <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
         >
            <CircularProgress />
         </Box>
      );
   }

   return (
      <Box m="20px">
         {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
               {error}
            </Alert>
         )}

         <Typography
            variant="h4"
            fontWeight="bold"
            color={colors.grey[100]}
            mb={4}
         >
            Pending Investment Confirmations
         </Typography>

         <TableContainer
            component={Paper}
            sx={{ backgroundColor: colors.primary[400] }}
         >
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell sx={{ color: colors.grey[100] }}>
                        Investor
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
                     <TableCell sx={{ color: colors.grey[100] }}>
                        Action
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {pendingInvestments.map((investment) => (
                     <TableRow key={investment._id}>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {investment.investor.name}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {investment.project.title}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {investment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {new Date(investment.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                           <Tooltip title="View Details">
                              <IconButton
                                 onClick={() => handleViewDetails(investment)}
                              >
                                 <VisibilityIcon
                                    sx={{ color: colors.blueAccent[400] }}
                                 />
                              </IconButton>
                           </Tooltip>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>

         <Dialog
            open={detailsModal.open}
            onClose={() => setDetailsModal({ open: false, investment: null })}
            maxWidth="md"
            fullWidth
         >
            <DialogTitle
               sx={{
                  bgcolor: colors.primary[400],
                  color: colors.grey[100],
               }}
            >
               Investment Details
            </DialogTitle>
            <DialogContent sx={{ bgcolor: colors.primary[400], mt: 2 }}>
               {detailsModal.investment && (
                  <Box>
                     <Grid container spacing={2}>
                        <Grid item xs={12}>
                           <Typography
                              variant="subtitle2"
                              color={colors.grey[300]}
                           >
                              Project Information
                           </Typography>
                           <Paper
                              sx={{ p: 2, bgcolor: colors.primary[500], mt: 1 }}
                           >
                              <Grid container spacing={2}>
                                 <Grid item xs={12}>
                                    <Typography
                                       variant="h5"
                                       color={colors.grey[100]}
                                       gutterBottom
                                    >
                                       {detailsModal.investment.project.title}
                                    </Typography>
                                    <Typography
                                       color={colors.grey[300]}
                                       paragraph
                                    >
                                       {
                                          detailsModal.investment.project
                                             .description
                                       }
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={6}>
                                    <Box
                                       bgcolor={colors.primary[400]}
                                       p={2}
                                       borderRadius={1}
                                    >
                                       <Typography
                                          variant="subtitle2"
                                          color={colors.grey[300]}
                                       >
                                          Project Details
                                       </Typography>
                                       <Box mt={1}>
                                          <Typography color={colors.grey[100]}>
                                             Location:{' '}
                                             {
                                                detailsModal.investment.project
                                                   .location
                                             }
                                          </Typography>
                                          <Typography color={colors.grey[100]}>
                                             Duration:{' '}
                                             {
                                                detailsModal.investment.project
                                                   .duration
                                             }{' '}
                                             months
                                          </Typography>
                                          <Typography color={colors.grey[100]}>
                                             Expected Return:{' '}
                                             {
                                                detailsModal.investment.project
                                                   .expectedReturn
                                             }
                                             %
                                          </Typography>
                                       </Box>
                                    </Box>
                                 </Grid>
                                 <Grid item xs={6}>
                                    <Box
                                       bgcolor={colors.primary[400]}
                                       p={2}
                                       borderRadius={1}
                                    >
                                       <Typography
                                          variant="subtitle2"
                                          color={colors.grey[300]}
                                       >
                                          Unit Information
                                       </Typography>
                                       <Box mt={1}>
                                          <Typography color={colors.grey[100]}>
                                             Unit Price:{' '}
                                             {detailsModal.investment.project?.unitPrice?.toLocaleString() ||
                                                0}{' '}
                                             FCFA
                                          </Typography>
                                          <Typography color={colors.grey[100]}>
                                             Total Units:{' '}
                                             {detailsModal.investment.project
                                                ?.totalUnits || 0}
                                          </Typography>
                                          <Typography color={colors.grey[100]}>
                                             Units Available:{' '}
                                             {calculateAvailableUnits(
                                                detailsModal.investment.project
                                             )}
                                          </Typography>
                                          <Typography
                                             color={colors.greenAccent[400]}
                                          >
                                             Progress:{' '}
                                             {calculateProgress(
                                                detailsModal.investment.project
                                             )}
                                             %
                                          </Typography>
                                       </Box>
                                    </Box>
                                 </Grid>
                              </Grid>
                           </Paper>
                        </Grid>

                        <Grid item xs={6}>
                           <Typography
                              variant="subtitle2"
                              color={colors.grey[300]}
                           >
                              Investor Information
                           </Typography>
                           <Paper
                              sx={{ p: 2, bgcolor: colors.primary[500], mt: 1 }}
                           >
                              <Typography color={colors.grey[100]}>
                                 Name: {detailsModal.investment.investor.name}
                              </Typography>
                              <Typography color={colors.grey[100]}>
                                 Email: {detailsModal.investment.investor.email}
                              </Typography>
                              <Typography color={colors.grey[100]}>
                                 Phone: {detailsModal.investment.investor.phone}
                              </Typography>
                              <Typography color={colors.grey[100]}>
                                 Type: {detailsModal.investment.investor.type}
                              </Typography>
                           </Paper>
                        </Grid>

                        <Grid item xs={6}>
                           <Typography
                              variant="subtitle2"
                              color={colors.grey[300]}
                           >
                              Investment Request
                           </Typography>
                           <Paper
                              sx={{ p: 2, bgcolor: colors.primary[500], mt: 1 }}
                           >
                              <Box
                                 display="flex"
                                 flexDirection="column"
                                 gap={1}
                              >
                                 <Typography color={colors.grey[100]}>
                                    Amount:{' '}
                                    {detailsModal.investment.amount.toLocaleString()}{' '}
                                    FCFA
                                 </Typography>
                                 <Typography color={colors.grey[100]}>
                                    Units Requested:{' '}
                                    {detailsModal.investment.units}
                                 </Typography>
                                 <Typography color={colors.grey[100]}>
                                    Submitted:{' '}
                                    {formatDate(
                                       detailsModal.investment.createdAt
                                    )}
                                 </Typography>
                                 <Typography color={colors.grey[100]}>
                                    Payment Status:{' '}
                                    {detailsModal.investment.paymentStatus}
                                 </Typography>
                              </Box>
                           </Paper>
                        </Grid>

                        <Grid item xs={12}>
                           <Box
                              display="flex"
                              justifyContent="flex-end"
                              gap={2}
                              mt={2}
                           >
                              <Button
                                 onClick={() =>
                                    handleConfirmClick(detailsModal.investment)
                                 }
                                 startIcon={<CheckCircleIcon />}
                                 variant="contained"
                                 color="success"
                                 size="large"
                              >
                                 Confirm Investment
                              </Button>
                              <Button
                                 onClick={() =>
                                    handleRejectClick(detailsModal.investment)
                                 }
                                 startIcon={<CancelIcon />}
                                 variant="contained"
                                 color="error"
                                 size="large"
                              >
                                 Reject Investment
                              </Button>
                           </Box>
                        </Grid>
                     </Grid>
                  </Box>
               )}
            </DialogContent>
         </Dialog>

         <Dialog
            open={confirmDialog.open}
            onClose={() => setConfirmDialog({ open: false, action: null })}
         >
            <DialogTitle>
               {confirmDialog.action === 'confirm'
                  ? 'Confirm Investment'
                  : 'Reject Investment'}
            </DialogTitle>
            <DialogContent>
               Are you sure you want to {confirmDialog.action} this investment
               of {selectedInvestment?.amount?.toLocaleString()} FCFA by{' '}
               {selectedInvestment?.investor?.name}?
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={() =>
                     setConfirmDialog({ open: false, action: null })
                  }
               >
                  Cancel
               </Button>
               <Button
                  onClick={() =>
                     confirmDialog.action === 'confirm'
                        ? handleConfirm(selectedInvestment._id)
                        : handleReject(selectedInvestment._id)
                  }
                  color={
                     confirmDialog.action === 'confirm' ? 'success' : 'error'
                  }
                  variant="contained"
               >
                  {confirmDialog.action === 'confirm' ? 'Confirm' : 'Reject'}
               </Button>
            </DialogActions>
         </Dialog>

         {pendingInvestments.length === 0 && !loading && (
            <Box textAlign="center" mt={4}>
               <Typography variant="h6" color={colors.grey[300]}>
                  No pending investments to confirm.
               </Typography>
            </Box>
         )}
      </Box>
   );
};

export default InvestmentConfirmationPage;
