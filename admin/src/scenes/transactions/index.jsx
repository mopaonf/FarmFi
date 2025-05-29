import React, { useState, useEffect } from 'react';
import {
   Box,
   Typography,
   TextField,
   IconButton,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   Select,
   MenuItem,
   useTheme,
   CircularProgress,
   Alert,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   Tooltip,
   Grid,
} from '@mui/material';
import { tokens } from '../../theme';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';

const formatDate = (dateString) => {
   try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return format(date, 'MMM d, yyyy HH:mm');
   } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
   }
};

const TransactionPage = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);

   const getStatusColor = (status) => {
      if (!status) return colors?.grey?.[100] || '#fff';

      switch (status.toLowerCase()) {
         case 'completed':
         case 'confirmed':
            return colors?.greenAccent?.[500] || '#4caf50';
         case 'pending':
            return colors?.yellowAccent?.[500] || '#ffc107';
         case 'failed':
         case 'rejected':
            return colors?.redAccent?.[500] || '#f44336';
         default:
            return colors?.grey?.[100] || '#fff';
      }
   };

   const [searchQuery, setSearchQuery] = useState('');
   const [selectedFilter, setSelectedFilter] = useState('All');
   const [transactions, setTransactions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [selectedTransaction, setSelectedTransaction] = useState(null);
   const [detailsModal, setDetailsModal] = useState(false);
   const [actionLoading, setActionLoading] = useState(false);
   const [actionError, setActionError] = useState(null);

   useEffect(() => {
      fetchTransactions();
   }, []);

   const fetchTransactions = async () => {
      try {
         const token = localStorage.getItem('adminToken');
         const response = await fetch(
            'http://localhost:5000/api/transactions',
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         if (!response.ok) {
            throw new Error('Failed to fetch transactions');
         }

         const data = await response.json();
         setTransactions(data);
      } catch (error) {
         setError(error.message);
      } finally {
         setLoading(false);
      }
   };

   const handleViewDetails = (transaction) => {
      setSelectedTransaction(transaction);
      setDetailsModal(true);
   };

   // Admin action handlers
   const handleApproveWithdraw = async (transaction) => {
      setActionLoading(true);
      setActionError(null);
      try {
         const token = localStorage.getItem('adminToken');
         await fetch(
            `http://localhost:5000/api/transactions/${transaction._id}/approve-withdrawal`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         setDetailsModal(false);
         fetchTransactions();
      } catch (err) {
         setActionError('Failed to approve withdrawal.');
      }
      setActionLoading(false);
   };

   const handleDeclineWithdraw = async (transaction) => {
      setActionLoading(true);
      setActionError(null);
      try {
         const token = localStorage.getItem('adminToken');
         await fetch(
            `http://localhost:5000/api/transactions/${transaction._id}/decline-withdrawal`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         setDetailsModal(false);
         fetchTransactions();
      } catch (err) {
         setActionError('Failed to decline withdrawal.');
      }
      setActionLoading(false);
   };

   // Filter transactions based on search query and selected filter
   const filteredTransactions = transactions.filter((transaction) => {
      const matchesSearch =
         transaction?.reference
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
         transaction?.user?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
         transaction?.user?.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
      const matchesFilter =
         selectedFilter === 'All' ||
         transaction?.status?.toLowerCase() === selectedFilter.toLowerCase();
      return matchesSearch && matchesFilter;
   });

   return (
      <Box m="20px">
         {/* Header */}
         <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
         >
            <Box>
               <Typography
                  variant="h4"
                  fontWeight="bold"
                  color={colors.grey?.[100] || '#fff'} // Fallback color
               >
                  TRANSACTIONS
               </Typography>
               <Typography
                  variant="subtitle1"
                  color={colors.greenAccent?.[400] || '#00ff00'} // Fallback color
               >
                  Manage and monitor all transactions
               </Typography>
            </Box>
         </Box>

         {/* Search and Filter */}
         <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
         >
            <Box display="flex" alignItems="center" gap={2}>
               <TextField
                  variant="outlined"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                     startAdornment: (
                        <IconButton>
                           <SearchIcon />
                        </IconButton>
                     ),
                  }}
                  sx={{
                     backgroundColor: colors.primary?.[400] || '#333', // Fallback color
                     borderRadius: '8px',
                     width: '300px',
                  }}
               />
               <Select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  displayEmpty
                  sx={{
                     backgroundColor: colors.primary?.[400] || '#333', // Fallback color
                     borderRadius: '8px',
                     width: '200px',
                  }}
               >
                  <MenuItem value="All">All Status</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
               </Select>
            </Box>
         </Box>

         {/* Transactions Table */}
         <TableContainer
            component={Paper}
            sx={{
               backgroundColor: colors.primary?.[400] || '#333', // Fallback color
               borderRadius: '8px',
               boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            }}
         >
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell sx={{ color: colors.grey?.[100] || '#fff' }}>
                        Reference
                     </TableCell>
                     <TableCell sx={{ color: colors.grey?.[100] || '#fff' }}>
                        User
                     </TableCell>
                     <TableCell sx={{ color: colors.grey?.[100] || '#fff' }}>
                        Type
                     </TableCell>
                     <TableCell sx={{ color: colors.grey?.[100] || '#fff' }}>
                        Amount (FCFA)
                     </TableCell>
                     <TableCell sx={{ color: colors.grey?.[100] || '#fff' }}>
                        Status
                     </TableCell>
                     <TableCell sx={{ color: colors.grey?.[100] || '#fff' }}>
                        Date
                     </TableCell>
                     <TableCell sx={{ color: colors.grey?.[100] || '#fff' }}>
                        Actions
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {filteredTransactions.map((transaction) => {
                     // User/farmer/admin name logic
                     let displayName = 'Unknown User';
                     let displayEmail = '';
                     // Investor or Farmer (populated user or userId)
                     if (transaction?.user?.name) {
                        displayName = transaction.user.name;
                        displayEmail = transaction.user.email || '';
                     } else if (
                        transaction?.userId &&
                        typeof transaction.userId === 'object' &&
                        transaction.userId.name
                     ) {
                        displayName = transaction.userId.name;
                        displayEmail = transaction.userId.email || '';
                     } else if (
                        transaction?.farmer &&
                        typeof transaction.farmer === 'object' &&
                        transaction.farmer.name
                     ) {
                        // Farmer disbursement (if backend populates farmer)
                        displayName = transaction.farmer.name;
                        displayEmail = transaction.farmer.email || '';
                     } else if (
                        transaction?.admin &&
                        typeof transaction.admin === 'object' &&
                        transaction.admin.name
                     ) {
                        // Admin transaction (if backend populates admin)
                        displayName = transaction.admin.name + ' (Admin)';
                        displayEmail = transaction.admin.email || '';
                     } else if (transaction.type === 'disbursement') {
                        displayName = 'Admin';
                     }
                     // fallback to userId string if nothing else
                     if (
                        displayName === 'Unknown User' &&
                        transaction?.userId &&
                        typeof transaction.userId === 'string'
                     ) {
                        displayName = transaction.userId;
                     }

                     return (
                        <TableRow key={transaction._id}>
                           <TableCell
                              sx={{ color: colors.grey?.[300] || '#ccc' }}
                           >
                              {transaction.reference}
                           </TableCell>
                           <TableCell
                              sx={{ color: colors.grey?.[300] || '#ccc' }}
                           >
                              {displayName}
                              {displayEmail && (
                                 <Typography
                                    variant="caption"
                                    display="block"
                                    color={colors.grey?.[400]}
                                 >
                                    {displayEmail}
                                 </Typography>
                              )}
                           </TableCell>
                           <TableCell
                              sx={{ color: colors.grey?.[300] || '#ccc' }}
                           >
                              {transaction.type}
                           </TableCell>
                           <TableCell
                              sx={{ color: colors.grey?.[300] || '#ccc' }}
                           >
                              {transaction.amount.toLocaleString()}
                           </TableCell>
                           <TableCell>
                              <Typography
                                 color={getStatusColor(transaction?.status)}
                                 sx={{ textTransform: 'capitalize' }}
                              >
                                 {transaction?.status || 'Unknown'}
                              </Typography>
                           </TableCell>
                           <TableCell
                              sx={{ color: colors.grey?.[300] || '#ccc' }}
                           >
                              {formatDate(transaction.createdAt)}
                           </TableCell>
                           <TableCell>
                              <IconButton
                                 onClick={() => handleViewDetails(transaction)}
                              >
                                 <Tooltip title="View Details">
                                    <VisibilityIcon
                                       sx={{ color: colors.blueAccent[400] }}
                                    />
                                 </Tooltip>
                              </IconButton>
                           </TableCell>
                        </TableRow>
                     );
                  })}
               </TableBody>
            </Table>
         </TableContainer>

         {/* Transaction Details Modal */}
         <Dialog
            open={detailsModal}
            onClose={() => setDetailsModal(false)}
            maxWidth="md"
            fullWidth
         >
            {selectedTransaction && (
               <>
                  <DialogTitle
                     sx={{
                        bgcolor: colors.primary[400],
                        color: colors.grey[100],
                     }}
                  >
                     Transaction Details
                  </DialogTitle>
                  <DialogContent sx={{ bgcolor: colors.primary[400], mt: 2 }}>
                     <Grid container spacing={2}>
                        <Grid item xs={12}>
                           <Typography variant="h6" color={colors.grey[100]}>
                              Transaction Information
                           </Typography>
                           <Box
                              sx={{
                                 bgcolor: colors.primary[500],
                                 p: 2,
                                 borderRadius: 1,
                                 mt: 1,
                              }}
                           >
                              <Grid container spacing={2}>
                                 <Grid item xs={6}>
                                    <Typography color={colors.grey[300]}>
                                       Reference:
                                    </Typography>
                                    <Typography color={colors.grey[100]}>
                                       {selectedTransaction.reference}
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={6}>
                                    <Typography color={colors.grey[300]}>
                                       Amount:
                                    </Typography>
                                    <Typography color={colors.grey[100]}>
                                       {selectedTransaction.amount?.toLocaleString()}{' '}
                                       FCFA
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={6}>
                                    <Typography color={colors.grey[300]}>
                                       Type:
                                    </Typography>
                                    <Typography color={colors.grey[100]}>
                                       {selectedTransaction.type}
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={6}>
                                    <Typography color={colors.grey[300]}>
                                       Status:
                                    </Typography>
                                    <Typography
                                       color={getStatusColor(
                                          selectedTransaction.status
                                       )}
                                    >
                                       {selectedTransaction.status}
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={12}>
                                    <Typography color={colors.grey[300]}>
                                       Date:
                                    </Typography>
                                    <Typography color={colors.grey[100]}>
                                       {formatDate(
                                          selectedTransaction.createdAt
                                       )}
                                    </Typography>
                                 </Grid>
                                 {selectedTransaction.description && (
                                    <Grid item xs={12}>
                                       <Typography color={colors.grey[300]}>
                                          Description:
                                       </Typography>
                                       <Typography color={colors.grey[100]}>
                                          {selectedTransaction.description}
                                       </Typography>
                                    </Grid>
                                 )}
                              </Grid>
                           </Box>
                        </Grid>

                        {/* Related Investment or Project for disbursement */}
                        {selectedTransaction.type === 'investment' &&
                        selectedTransaction.investment ? (
                           <Grid item xs={12}>
                              <Typography variant="h6" color={colors.grey[100]}>
                                 Related Investment
                              </Typography>
                              <Box
                                 sx={{
                                    bgcolor: colors.primary[500],
                                    p: 2,
                                    borderRadius: 1,
                                    mt: 1,
                                 }}
                              >
                                 <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                       <Typography color={colors.grey[300]}>
                                          Project:
                                       </Typography>
                                       <Typography color={colors.grey[100]}>
                                          {selectedTransaction.investment
                                             .project?.title || 'N/A'}
                                       </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                       <Typography color={colors.grey[300]}>
                                          Units:
                                       </Typography>
                                       <Typography color={colors.grey[100]}>
                                          {selectedTransaction.investment
                                             .units ?? 'N/A'}
                                       </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                       <Typography color={colors.grey[300]}>
                                          Investment Amount:
                                       </Typography>
                                       <Typography color={colors.grey[100]}>
                                          {selectedTransaction.investment.amount?.toLocaleString() ||
                                             'N/A'}{' '}
                                          FCFA
                                       </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                       <Typography color={colors.grey[300]}>
                                          Investment Status:
                                       </Typography>
                                       <Typography
                                          color={getStatusColor(
                                             selectedTransaction.investment
                                                .status
                                          )}
                                       >
                                          {selectedTransaction.investment
                                             .status || 'N/A'}
                                       </Typography>
                                    </Grid>
                                 </Grid>
                              </Box>
                           </Grid>
                        ) : selectedTransaction.type === 'disbursement' &&
                          (selectedTransaction.disbursementProject ||
                             selectedTransaction.project) ? (
                           <Grid item xs={12}>
                              <Typography variant="h6" color={colors.grey[100]}>
                                 Related Project
                              </Typography>
                              <Box
                                 sx={{
                                    bgcolor: colors.primary[500],
                                    p: 2,
                                    borderRadius: 1,
                                    mt: 1,
                                 }}
                              >
                                 <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                       <Typography color={colors.grey[300]}>
                                          Project:
                                       </Typography>
                                       <Typography color={colors.grey[100]}>
                                          {selectedTransaction
                                             .disbursementProject?.title ||
                                             selectedTransaction.project
                                                ?.title ||
                                             'N/A'}
                                       </Typography>
                                    </Grid>
                                    {selectedTransaction.disbursementProject
                                       ?.description && (
                                       <Grid item xs={12}>
                                          <Typography color={colors.grey[300]}>
                                             Description:
                                          </Typography>
                                          <Typography color={colors.grey[100]}>
                                             {
                                                selectedTransaction
                                                   .disbursementProject
                                                   .description
                                             }
                                          </Typography>
                                       </Grid>
                                    )}
                                    {selectedTransaction.disbursementProject
                                       ?.unitPrice && (
                                       <Grid item xs={12}>
                                          <Typography color={colors.grey[300]}>
                                             Unit Price:
                                          </Typography>
                                          <Typography color={colors.grey[100]}>
                                             {selectedTransaction.disbursementProject.unitPrice.toLocaleString()}{' '}
                                             FCFA
                                          </Typography>
                                       </Grid>
                                    )}
                                 </Grid>
                              </Box>
                           </Grid>
                        ) : null}

                        {/* Admin actions for pending withdrawal */}
                        {selectedTransaction.type === 'withdrawal' &&
                           selectedTransaction.status === 'pending' && (
                              <Grid item xs={12} mt={2}>
                                 <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    gap={2}
                                 >
                                    <Button
                                       variant="contained"
                                       color="success"
                                       startIcon={<CheckIcon />}
                                       disabled={actionLoading}
                                       onClick={() =>
                                          handleApproveWithdraw(
                                             selectedTransaction
                                          )
                                       }
                                    >
                                       {actionLoading
                                          ? 'Processing...'
                                          : 'Approve'}
                                    </Button>
                                    <Button
                                       variant="contained"
                                       color="error"
                                       startIcon={<CloseIcon />}
                                       disabled={actionLoading}
                                       onClick={() =>
                                          handleDeclineWithdraw(
                                             selectedTransaction
                                          )
                                       }
                                    >
                                       {actionLoading
                                          ? 'Processing...'
                                          : 'Decline'}
                                    </Button>
                                    {actionError && (
                                       <Typography color="error" ml={2}>
                                          {actionError}
                                       </Typography>
                                    )}
                                 </Box>
                              </Grid>
                           )}
                     </Grid>
                  </DialogContent>
                  <DialogActions sx={{ bgcolor: colors.primary[400] }}>
                     <Button onClick={() => setDetailsModal(false)}>
                        Close
                     </Button>
                  </DialogActions>
               </>
            )}
         </Dialog>

         {/* Loading and Error States */}
         {loading && (
            <Box display="flex" justifyContent="center" m={4}>
               <CircularProgress />
            </Box>
         )}

         {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
               {error}
            </Alert>
         )}
      </Box>
   );
};

export default TransactionPage;
