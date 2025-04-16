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
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { mockDataContacts } from '../../data/mockData';

const FarmersPage = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedFilter, setSelectedFilter] = useState('All');

   // Filter farmers based on search query and selected filter
   const filteredFarmers = mockDataContacts.filter((farmer) => {
      const matchesSearch =
         farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         farmer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
         farmer.phone.includes(searchQuery);
      const matchesFilter =
         selectedFilter === 'All' || farmer.city === selectedFilter;
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
                  color={colors.grey[100]}
               >
                  FARMERS
               </Typography>
               <Typography variant="subtitle1" color={colors.greenAccent[400]}>
                  Manage and monitor registered farmers
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
                  placeholder="Search farmers..."
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
                  <MenuItem value="All">All Cities</MenuItem>
                  {[
                     ...new Set(mockDataContacts.map((farmer) => farmer.city)),
                  ].map((city, index) => (
                     <MenuItem key={index} value={city}>
                        {city}
                     </MenuItem>
                  ))}
               </Select>
            </Box>
         </Box>

         {/* Farmers Table */}
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
                        City
                     </TableCell>
                     <TableCell sx={{ color: colors.grey[100] }}>
                        Actions
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {filteredFarmers.map((farmer) => (
                     <TableRow key={farmer.id}>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {farmer.name}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {farmer.email}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {farmer.phone}
                        </TableCell>
                        <TableCell sx={{ color: colors.grey[300] }}>
                           {farmer.city}
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
                              <Tooltip title="Edit Farmer">
                                 <IconButton>
                                    <EditIcon
                                       sx={{ color: colors.blueAccent[400] }}
                                    />
                                 </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Farmer">
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
         {filteredFarmers.length === 0 && (
            <Box textAlign="center" mt={4}>
               <Typography variant="h6" color={colors.grey[300]}>
                  No farmers found matching your criteria.
               </Typography>
            </Box>
         )}
      </Box>
   );
};

export default FarmersPage;
