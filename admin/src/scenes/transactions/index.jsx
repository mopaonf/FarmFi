import React, { useState } from 'react';
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
   Tooltip,
} from '@mui/material';
import { tokens } from '../../theme';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { mockTransactions } from '../../data/mockData';

const TransactionPage = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode) || {}; // Ensure colors is always an object
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedFilter, setSelectedFilter] = useState('All');

   // Filter transactions based on search query and selected filter
   const filteredTransactions = mockTransactions.filter((transaction) => {
      const matchesSearch =
         transaction.txId.toLowerCase().includes(searchQuery.toLowerCase()) ||
         transaction.user.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
         selectedFilter === 'All' || transaction.status === selectedFilter;
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
                        Transaction ID
                     </TableCell>
                     <TableCell sx={{ color: colors.grey?.[100] || '#fff' }}>
                        User
                     </TableCell>
                     <TableCell sx={{ color: colors.grey?.[100] || '#fff' }}>
                        Date
                     </TableCell>
                     <TableCell sx={{ color: colors.grey?.[100] || '#fff' }}>
                        Amount (FCFA)
                     </TableCell>
                     <TableCell sx={{ color: colors.grey?.[100] || '#fff' }}>
                        Status
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {filteredTransactions.map((transaction) => (
                     <TableRow key={transaction.txId}>
                        <TableCell sx={{ color: colors.grey?.[300] || '#ccc' }}>
                           {transaction.txId}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey?.[300] || '#ccc' }}>
                           {transaction.user}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey?.[300] || '#ccc' }}>
                           {transaction.date}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey?.[300] || '#ccc' }}>
                           {transaction.cost.toLocaleString()}
                        </TableCell>
                        <TableCell
                           sx={{
                              color:
                                 transaction.status === 'Completed'
                                    ? colors.greenAccent?.[400] || '#0f0'
                                    : colors.yellowAccent?.[400] || '#ff0',
                           }}
                        >
                           {transaction.status}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>

         {/* No Results Message */}
         {filteredTransactions.length === 0 && (
            <Box textAlign="center" mt={4}>
               <Typography variant="h6" color={colors.grey?.[300] || '#ccc'}>
                  No transactions found matching your criteria.
               </Typography>
            </Box>
         )}
      </Box>
   );
};

export default TransactionPage;
