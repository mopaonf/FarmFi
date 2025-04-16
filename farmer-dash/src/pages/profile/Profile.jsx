import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import {
   Box,
   Typography,
   Card,
   Avatar,
   Divider,
   Button,
   Modal,
   TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';

const Profile = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const navigate = useNavigate(); // Initialize useNavigate

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [profileData, setProfileData] = useState(null); // Initialize as null

   useEffect(() => {
      const fetchProfile = async () => {
         try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
               'http://localhost:5000/api/farmers/profile',
               {
                  headers: { Authorization: `Bearer ${token}` },
               }
            );
            setProfileData(response.data); // Dynamically set profile data
         } catch (error) {
            console.error('Error fetching profile:', error);
         }
      };
      fetchProfile();
   }, []);

   const handleOpenModal = () => setIsModalOpen(true);
   const handleCloseModal = () => setIsModalOpen(false);

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProfileData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSaveChanges = async () => {
      try {
         const token = localStorage.getItem('token');
         const response = await axios.put(
            'http://localhost:5000/api/farmers/profile', // Ensure this matches the backend route
            profileData,
            { headers: { Authorization: `Bearer ${token}` } }
         );
         setProfileData(response.data.updatedFarmer); // Update profile data
         handleCloseModal();
      } catch (error) {
         console.error('Error saving profile changes:', error);
      }
   };

   const handleDeleteAccount = async () => {
      try {
         const token = localStorage.getItem('token');
         await axios.delete('http://localhost:5000/api/farmers/profile', {
            headers: { Authorization: `Bearer ${token}` },
         });
         localStorage.removeItem('token'); // Clear token
         navigate('/auth'); // Redirect to auth page
      } catch (error) {
         console.error('Error deleting account:', error);
      }
   };

   const handleLogout = () => {
      localStorage.removeItem('token'); // Clear the token
      navigate('/auth'); // Redirect to the auth page
   };

   const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
   };

   if (!profileData) {
      return <Typography>Loading...</Typography>; // Show loading state
   }

   return (
      <Box m="20px">
         {/* Header */}
         <Box mb="20px">
            <Typography
               variant="h4"
               fontWeight="bold"
               color={colors.grey[100]}
               mb={1}
            >
               My Profile
            </Typography>
            <Typography variant="subtitle1" color={colors.greenAccent[400]}>
               Manage your personal information and account settings
            </Typography>
         </Box>

         {/* Profile Overview */}
         <Card
            sx={{
               padding: '20px',
               backgroundColor: colors.primary[400],
               borderRadius: '12px',
               boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
               display: 'flex',
               alignItems: 'center',
               gap: '20px',
            }}
         >
            <Avatar
               sx={{
                  width: 100,
                  height: 100,
                  backgroundColor: colors.greenAccent[500],
                  fontSize: '40px',
               }}
            >
               {profileData.fullName
                  ? profileData.fullName
                       .split(' ')
                       .map((n) => n[0])
                       .join('')
                  : 'N/A'}{' '}
               {/* Safely access fullName */}
            </Avatar>
            <Box>
               <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={colors.grey[100]}
               >
                  {profileData.name || 'N/A'} {/* Safely access name */}
               </Typography>
               <Typography variant="body1" color={colors.grey[300]} mt={1}>
                  {profileData.email || 'N/A'} {/* Safely access email */}
               </Typography>
               <Typography
                  variant="body2"
                  color={colors.greenAccent[400]}
                  mt={1}
               >
                  Farmer since{' '}
                  {profileData.createdAt
                     ? formatDate(profileData.createdAt)
                     : 'N/A'}{' '}
               </Typography>
            </Box>
         </Card>

         {/* Account Details */}
         <Card
            sx={{
               marginTop: '20px',
               padding: '20px',
               backgroundColor: colors.primary[400],
               borderRadius: '12px',
               boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            }}
         >
            <Typography
               variant="h6"
               fontWeight="bold"
               color={colors.grey[100]}
               mb={2}
            >
               Account Details
            </Typography>
            <Divider sx={{ backgroundColor: colors.grey[700], mb: 2 }} />
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap="20px">
               <Box>
                  <Typography variant="body2" color={colors.grey[300]}>
                     <strong>Full Name:</strong> {profileData.name || 'N/A'}{' '}
                     {/* Safely access name */}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]} mt={1}>
                     <strong>Email:</strong> {profileData.email || 'N/A'}{' '}
                     {/* Safely access email */}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]} mt={1}>
                     <strong>Phone:</strong> {profileData.phone || 'N/A'}{' '}
                     {/* Safely access phone */}
                  </Typography>
               </Box>
               <Box>
                  <Typography variant="body2" color={colors.grey[300]}>
                     <strong>Address:</strong> {profileData.address || 'N/A'}{' '}
                     {/* Safely access address */}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]} mt={1}>
                     <strong>Country:</strong> {profileData.country || 'N/A'}{' '}
                     {/* Safely access country */}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]} mt={1}>
                     <strong>Member Since:</strong>{' '}
                     {profileData.createdAt
                        ? formatDate(profileData.createdAt)
                        : 'N/A'}{' '}
                     {/* Display account creation date */}
                  </Typography>
               </Box>
            </Box>
         </Card>

         {/* Actions */}
         <Box mt="20px" display="flex" justifyContent="flex-end" gap="10px">
            <Button
               variant="contained"
               onClick={handleOpenModal}
               sx={{
                  backgroundColor: colors.greenAccent[500],
                  color: colors.grey[100],
                  '&:hover': {
                     backgroundColor: colors.greenAccent[600],
                  },
               }}
            >
               Edit Profile
            </Button>
            <Button
               variant="outlined"
               onClick={handleDeleteAccount} // Attach delete handler
               sx={{
                  borderColor: colors.redAccent[500],
                  color: colors.redAccent[500],
                  '&:hover': {
                     backgroundColor: colors.redAccent[500],
                     color: colors.grey[100],
                  },
               }}
            >
               Delete Account
            </Button>
            <Button
               variant="outlined"
               onClick={handleLogout}
               sx={{
                  borderColor: colors.grey[500],
                  color: colors.grey[500],
                  '&:hover': {
                     backgroundColor: colors.grey[700],
                     color: colors.grey[100],
                  },
               }}
            >
               Logout
            </Button>
         </Box>

         {/* Edit Profile Modal */}
         <Modal open={isModalOpen} onClose={handleCloseModal}>
            <Box
               sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: colors.primary[400],
                  borderRadius: '12px',
                  boxShadow: 24,
                  p: 4,
               }}
            >
               <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={colors.grey[100]}
                  mb={2}
               >
                  Edit Profile
               </Typography>
               <Box display="flex" flexDirection="column" gap="15px">
                  <TextField
                     label="Full Name"
                     name="fullName"
                     value={profileData.fullName}
                     onChange={handleInputChange}
                     fullWidth
                     variant="outlined"
                     sx={{
                        '& .MuiOutlinedInput-root': {
                           backgroundColor: '#ffffff', // White background
                           color: '#000000', // Black text
                        },
                        '& .MuiInputLabel-root': {
                           color: colors.grey[700], // Label color
                        },
                     }}
                  />
                  <TextField
                     label="Email"
                     name="email"
                     value={profileData.email}
                     onChange={handleInputChange}
                     fullWidth
                     variant="outlined"
                     sx={{
                        '& .MuiOutlinedInput-root': {
                           backgroundColor: '#ffffff', // White background
                           color: '#000000', // Black text
                        },
                        '& .MuiInputLabel-root': {
                           color: colors.grey[700], // Label color
                        },
                     }}
                  />
                  <TextField
                     label="Phone"
                     name="phone"
                     value={profileData.phone}
                     onChange={handleInputChange}
                     fullWidth
                     variant="outlined"
                     sx={{
                        '& .MuiOutlinedInput-root': {
                           backgroundColor: '#ffffff', // White background
                           color: '#000000', // Black text
                        },
                        '& .MuiInputLabel-root': {
                           color: colors.grey[700], // Label color
                        },
                     }}
                  />
                  <TextField
                     label="Address"
                     name="address"
                     value={profileData.address}
                     onChange={handleInputChange}
                     fullWidth
                     variant="outlined"
                     sx={{
                        '& .MuiOutlinedInput-root': {
                           backgroundColor: '#ffffff', // White background
                           color: '#000000', // Black text
                        },
                        '& .MuiInputLabel-root': {
                           color: colors.grey[700], // Label color
                        },
                     }}
                  />
                  <TextField
                     label="Country"
                     name="country"
                     value={profileData.country}
                     onChange={handleInputChange}
                     fullWidth
                     variant="outlined"
                     sx={{
                        '& .MuiOutlinedInput-root': {
                           backgroundColor: '#ffffff', // White background
                           color: '#000000', // Black text
                        },
                        '& .MuiInputLabel-root': {
                           color: colors.grey[700], // Label color
                        },
                     }}
                  />
               </Box>
               <Box mt={3} display="flex" justifyContent="flex-end" gap="10px">
                  <Button
                     onClick={handleCloseModal}
                     variant="outlined"
                     sx={{
                        borderColor: colors.grey[500],
                        color: colors.grey[500],
                        '&:hover': {
                           backgroundColor: colors.grey[700],
                           color: colors.grey[100],
                        },
                     }}
                  >
                     Cancel
                  </Button>
                  <Button
                     onClick={handleSaveChanges}
                     variant="contained"
                     sx={{
                        backgroundColor: colors.greenAccent[500],
                        color: colors.grey[100],
                        '&:hover': {
                           backgroundColor: colors.greenAccent[600],
                        },
                     }}
                  >
                     Save Changes
                  </Button>
               </Box>
            </Box>
         </Modal>
      </Box>
   );
};

export default Profile;
