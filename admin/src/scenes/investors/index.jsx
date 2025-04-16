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
   Slider,
} from '@mui/material';
import { tokens } from '../../theme';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { mockDataInvestors } from '../../data/mockData';

const InvestorsPage = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedFilter, setSelectedFilter] = useState('All');
   const [investmentRange, setInvestmentRange] = useState([0, 1000000]);

   // Filter investors based on search query, selected filter, and investment range
   const filteredInvestors = mockDataInvestors.filter((investor) => {
      const matchesSearch =
         investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         investor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
         investor.phone.includes(searchQuery);
      const matchesFilter =
         selectedFilter === 'All' || investor.type === selectedFilter;
      const matchesInvestmentRange =
         investor.totalInvestment >= investmentRange[0] &&
         investor.totalInvestment <= investmentRange[1];
      return matchesSearch && matchesFilter && matchesInvestmentRange;
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
                  color={colors.grey[100]}
               >
                  INVESTORS
               </Typography>
               <Typography variant="subtitle1" color={colors.greenAccent[400]}>
                  Manage and monitor registered investors
               </Typography>
            </Box>
         </Box>

         {/* Search and Filters */}
         <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
         >
            <Box display="flex" alignItems="center" gap={2}>
               <TextField
                  variant="outlined"
                  placeholder="Search investors..."
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
                     backgroundColor: colors.primary[400],
                     borderRadius: '8px',
                     width: '300px',
                  }}
               />
               <Select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  displayEmpty
                  sx={{
                     backgroundColor: colors.primary[400],
                     borderRadius: '8px',
                     width: '200px',
                  }}
               >
                  <MenuItem value="All">All Types</MenuItem>
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Corporate">Corporate</MenuItem>
               </Select>
            </Box>
            <Box width="300px">
               <Typography
                  variant="body2"
                  color={colors.grey[100]}
                  mb={1}
                  fontWeight="bold"
               >
                  Investment Range (FCFA)
               </Typography>
               <Slider
                  value={investmentRange}
                  onChange={(e, newValue) => setInvestmentRange(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000000}
                  sx={{
                     color: colors.greenAccent[400],
                  }}
               />
            </Box>
         </Box>

         {/* Investors Table */}
         <TableContainer
            component={Paper}
            sx={{
               backgroundColor: colors.primary[400],
               borderRadius: '8px',
               boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            }}
         >
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell sx={{ color: colors.grey[100] }}>
                        Name
                     </TableCell>
                     <TableCell sx={{ color: colors.grey[100] }}>
                        Email
                     </TableCell>
                     <TableCell sx={{ color: colors.grey[100] }}>
                        Phone
                     </TableCell>
                     <TableCell sx={{ color: colors.grey[100] }}>
                        Type
                     </TableCell>
                     <TableCell sx={{ color: colors.grey[100] }}>
                        Total Investment (FCFA)
                     </TableCell>
                     <TableCell sx={{ color: colors.grey[100] }}>
                        Actions
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {filteredInvestors.map((investor) => (
                     <TableRow key={investor.id}>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {investor.name}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {investor.email}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {investor.phone}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {investor.type}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {investor.totalInvestment.toLocaleString()}
                        </TableCell>
                        <TableCell>
                           <Box display="flex" gap={1}>
                              <Tooltip title="View Details">
                                 <IconButton>
                                    <VisibilityIcon
                                       sx={{ color: colors.greenAccent[400] }}
                                    />
                                 </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Investor">
                                 <IconButton>
                                    <EditIcon
                                       sx={{ color: colors.blueAccent[400] }}
                                    />
                                 </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Investor">
                                 <IconButton>
                                    <DeleteIcon
                                       sx={{ color: colors.redAccent[400] }}
                                    />
                                 </IconButton>
                              </Tooltip>
                           </Box>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>

         {/* No Results Message */}
         {filteredInvestors.length === 0 && (
            <Box textAlign="center" mt={4}>
               <Typography variant="h6" color={colors.grey[300]}>
                  No investors found matching your criteria.
               </Typography>
            </Box>
         )}
      </Box>
   );
};

export default InvestorsPage;
