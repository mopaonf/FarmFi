import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
   CircularProgress,
   Modal,
   Divider,
   TextField as MuiTextField,
   Button,
   Grid,
} from '@mui/material';
import { tokens } from '../../theme';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const FarmersPage = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [farmers, setFarmers] = useState([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedFilter, setSelectedFilter] = useState('All');
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [viewModalOpen, setViewModalOpen] = useState(false);
   const [editModalOpen, setEditModalOpen] = useState(false);
   const [selectedFarmer, setSelectedFarmer] = useState(null);
   const [editForm, setEditForm] = useState({
      name: '',
      email: '',
      phone: '',
      address: '',
   });

   useEffect(() => {
      fetchFarmers();
   }, []);

   const fetchFarmers = async () => {
      try {
         const token = localStorage.getItem('adminToken');
         const response = await axios.get('http://localhost:5000/api/farmers', {
            headers: { Authorization: `Bearer ${token}` },
         });
         setFarmers(response.data);
         setLoading(false);
      } catch (err) {
         console.error('Error fetching farmers:', err);
         setError('Failed to load farmers');
         setLoading(false);
      }
   };

   // Filter farmers based on search query and selected filter
   const filteredFarmers = farmers.filter((farmer) => {
      const matchesSearch =
         farmer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         farmer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         farmer.phone?.includes(searchQuery);
      const matchesFilter =
         selectedFilter === 'All' || farmer.address === selectedFilter;
      return matchesSearch && matchesFilter;
   });

   const handleDeleteFarmer = async (farmerId) => {
      try {
         const token = localStorage.getItem('adminToken');
         await axios.delete(`http://localhost:5000/api/farmers/${farmerId}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setFarmers(farmers.filter((farmer) => farmer._id !== farmerId));
      } catch (err) {
         console.error('Error deleting farmer:', err);
      }
   };

   const handleViewDetails = (farmerId) => {
      const farmer = farmers.find((f) => f._id === farmerId);
      setSelectedFarmer(farmer);
      setViewModalOpen(true);
   };

   const handleEdit = (farmerId) => {
      const farmer = farmers.find((f) => f._id === farmerId);
      setSelectedFarmer(farmer);
      setEditForm({
         name: farmer.name,
         email: farmer.email,
         phone: farmer.phone,
         address: farmer.address,
      });
      setEditModalOpen(true);
   };

   const handleUpdate = async () => {
      try {
         const token = localStorage.getItem('adminToken');
         await axios.put(
            `http://localhost:5000/api/farmers/${selectedFarmer._id}`,
            editForm,
            { headers: { Authorization: `Bearer ${token}` } }
         );

         setFarmers(
            farmers.map((farmer) =>
               farmer._id === selectedFarmer._id
                  ? { ...farmer, ...editForm }
                  : farmer
            )
         );

         setEditModalOpen(false);
      } catch (error) {
         console.error('Error updating farmer:', error);
      }
   };

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
                  <MenuItem value="All">All Locations</MenuItem>
                  {[...new Set(farmers.map((farmer) => farmer.address))].map(
                     (address, index) => (
                        <MenuItem key={index} value={address}>
                           {address}
                        </MenuItem>
                     )
                  )}
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
                        Address
                     </TableCell>
                     <TableCell sx={{ color: colors.grey[100] }}>
                        Actions
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {loading ? (
                     <TableRow>
                        <TableCell colSpan={5} align="center">
                           <CircularProgress />
                        </TableCell>
                     </TableRow>
                  ) : error ? (
                     <TableRow>
                        <TableCell
                           colSpan={5}
                           align="center"
                           sx={{ color: colors.redAccent[500] }}
                        >
                           {error}
                        </TableCell>
                     </TableRow>
                  ) : (
                     filteredFarmers.map((farmer) => (
                        <TableRow key={farmer._id}>
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
                              {farmer.address || 'N/A'}
                           </TableCell>
                           <TableCell>
                              <Box display="flex" gap={1}>
                                 <Tooltip title="View Details">
                                    <IconButton
                                       onClick={() =>
                                          handleViewDetails(farmer._id)
                                       }
                                    >
                                       <VisibilityIcon
                                          sx={{
                                             color: colors.greenAccent[400],
                                          }}
                                       />
                                    </IconButton>
                                 </Tooltip>
                                 <Tooltip title="Edit Farmer">
                                    <IconButton
                                       onClick={() => handleEdit(farmer._id)}
                                    >
                                       <EditIcon
                                          sx={{ color: colors.blueAccent[400] }}
                                       />
                                    </IconButton>
                                 </Tooltip>
                                 <Tooltip title="Delete Farmer">
                                    <IconButton
                                       onClick={() =>
                                          handleDeleteFarmer(farmer._id)
                                       }
                                    >
                                       <DeleteIcon
                                          sx={{ color: colors.redAccent[400] }}
                                       />
                                    </IconButton>
                                 </Tooltip>
                              </Box>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </TableContainer>

         {/* No Results Message */}
         {filteredFarmers.length === 0 && !loading && !error && (
            <Box textAlign="center" mt={4}>
               <Typography variant="h6" color={colors.grey[300]}>
                  No farmers found matching your criteria.
               </Typography>
            </Box>
         )}

         {/* View Modal */}
         <Modal
            open={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            aria-labelledby="view-farmer-modal"
         >
            <Box
               sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 600,
                  bgcolor: colors.primary[400],
                  borderRadius: '8px',
                  boxShadow: 24,
                  p: 4,
               }}
            >
               {selectedFarmer && (
                  <>
                     <Typography variant="h4" color={colors.grey[100]} mb={2}>
                        Farmer Details
                     </Typography>
                     <Divider sx={{ mb: 3 }} />

                     <Grid container spacing={2}>
                        <Grid item xs={12}>
                           <Typography variant="h6" color={colors.grey[100]}>
                              Name: {selectedFarmer.name}
                           </Typography>
                        </Grid>
                        <Grid item xs={12}>
                           <Typography variant="h6" color={colors.grey[100]}>
                              Email: {selectedFarmer.email}
                           </Typography>
                        </Grid>
                        <Grid item xs={12}>
                           <Typography variant="h6" color={colors.grey[100]}>
                              Phone: {selectedFarmer.phone}
                           </Typography>
                        </Grid>
                        <Grid item xs={12}>
                           <Typography variant="h6" color={colors.grey[100]}>
                              Address: {selectedFarmer.address}
                           </Typography>
                        </Grid>
                     </Grid>
                  </>
               )}
            </Box>
         </Modal>

         {/* Edit Modal */}
         <Modal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            aria-labelledby="edit-farmer-modal"
         >
            <Box
               sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 600,
                  bgcolor: colors.primary[400],
                  borderRadius: '8px',
                  boxShadow: 24,
                  p: 4,
               }}
            >
               <Typography variant="h4" color={colors.grey[100]} mb={2}>
                  Edit Farmer
               </Typography>
               <Divider sx={{ mb: 3 }} />

               <Grid container spacing={3}>
                  <Grid item xs={12}>
                     <MuiTextField
                        fullWidth
                        label="Name"
                        value={editForm.name}
                        onChange={(e) =>
                           setEditForm({ ...editForm, name: e.target.value })
                        }
                        sx={{
                           '& label': { color: colors.grey[300] },
                           '& input': { color: colors.grey[100] },
                           '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: colors.grey[500] },
                              '&:hover fieldset': {
                                 borderColor: colors.grey[100],
                              },
                           },
                        }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <MuiTextField
                        fullWidth
                        label="Email"
                        value={editForm.email}
                        onChange={(e) =>
                           setEditForm({ ...editForm, email: e.target.value })
                        }
                        sx={{
                           '& label': { color: colors.grey[300] },
                           '& input': { color: colors.grey[100] },
                           '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: colors.grey[500] },
                              '&:hover fieldset': {
                                 borderColor: colors.grey[100],
                              },
                           },
                        }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <MuiTextField
                        fullWidth
                        label="Phone"
                        value={editForm.phone}
                        onChange={(e) =>
                           setEditForm({ ...editForm, phone: e.target.value })
                        }
                        sx={{
                           '& label': { color: colors.grey[300] },
                           '& input': { color: colors.grey[100] },
                           '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: colors.grey[500] },
                              '&:hover fieldset': {
                                 borderColor: colors.grey[100],
                              },
                           },
                        }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <MuiTextField
                        fullWidth
                        label="Address"
                        value={editForm.address}
                        onChange={(e) =>
                           setEditForm({ ...editForm, address: e.target.value })
                        }
                        sx={{
                           '& label': { color: colors.grey[300] },
                           '& input': { color: colors.grey[100] },
                           '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: colors.grey[500] },
                              '&:hover fieldset': {
                                 borderColor: colors.grey[100],
                              },
                           },
                        }}
                     />
                  </Grid>
               </Grid>

               <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                  <Button
                     variant="contained"
                     color="inherit"
                     onClick={() => setEditModalOpen(false)}
                  >
                     Cancel
                  </Button>
                  <Button
                     variant="contained"
                     sx={{ bgcolor: colors.greenAccent[600] }}
                     onClick={handleUpdate}
                  >
                     Save Changes
                  </Button>
               </Box>
            </Box>
         </Modal>
      </Box>
   );
};

export default FarmersPage;
