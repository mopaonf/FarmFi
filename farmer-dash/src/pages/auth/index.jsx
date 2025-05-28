import React, { useState } from 'react';
import {
   Box,
   Button,
   Typography,
   TextField,
   Grid,
   Paper,
   useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MotionBox = motion(Box);

const AuthPage = () => {
   const [isSignUp, setIsSignUp] = useState(true);
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      country: '',
   });

   const navigate = useNavigate();
   const theme = useTheme();

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const url = isSignUp
         ? 'http://localhost:5000/api/farmers/signup'
         : 'http://localhost:5000/api/farmers/login';

      try {
         const payload = isSignUp
            ? {
                 ...formData,
                 // Ensure all fields are strings and trimmed
                 name: formData.name?.trim(),
                 email: formData.email?.trim(),
                 password: formData.password,
                 phone: formData.phone?.trim(),
                 address: formData.address?.trim(),
                 country: formData.country?.trim(),
              }
            : {
                 email: formData.email?.trim(),
                 password: formData.password,
              };

         // Remove any undefined fields (for login)
         Object.keys(payload).forEach(
            (key) => payload[key] === undefined && delete payload[key]
         );

         const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json' },
         });
         const { token } = response.data;
         localStorage.setItem('token', token);

         if (!isSignUp) navigate('/dashboard');
         else alert('Signup successful! Please log in.');
      } catch (error) {
         // Show backend error message if available
         alert(
            error.response?.data?.message ||
               error.response?.data?.error ||
               'Something went wrong'
         );
      }
   };

   return (
      <Box
         sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
         }}
      >
         <MotionBox
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            component={Paper}
            elevation={6}
            sx={{
               width: '100%',
               maxWidth: 480,
               borderRadius: 3,
               p: 4,
               backgroundColor: '#fff',
            }}
         >
            <Typography
               variant="h4"
               align="center"
               fontWeight="bold"
               gutterBottom
               color="green"
            >
               {isSignUp ? 'Farmer Sign Up' : 'Log In'}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
               <Grid container spacing={2}>
                  {isSignUp && (
                     <>
                        <Grid item xs={12}>
                           <TextField
                              fullWidth
                              name="name"
                              label="Full Name"
                              variant="outlined"
                              value={formData.name}
                              onChange={handleChange}
                              required
                           />
                        </Grid>
                        <Grid item xs={12}>
                           <TextField
                              fullWidth
                              name="phone"
                              label="Phone Number"
                              variant="outlined"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                           />
                        </Grid>
                        <Grid item xs={12}>
                           <TextField
                              fullWidth
                              name="address"
                              label="Address"
                              variant="outlined"
                              value={formData.address}
                              onChange={handleChange}
                              required
                           />
                        </Grid>
                        <Grid item xs={12}>
                           <TextField
                              fullWidth
                              name="country"
                              label="Country"
                              variant="outlined"
                              value={formData.country}
                              onChange={handleChange}
                              required
                           />
                        </Grid>
                     </>
                  )}
                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        name="email"
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={formData.email}
                        onChange={handleChange}
                        required
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={formData.password}
                        onChange={handleChange}
                        required
                     />
                  </Grid>
               </Grid>

               <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                     fullWidth
                     variant="outlined"
                     onClick={() => setIsSignUp(true)}
                     sx={{
                        borderColor: isSignUp ? 'green' : '#c8e6c9',
                        color: isSignUp ? 'green' : '#757575',
                        fontWeight: isSignUp ? 600 : 400,
                     }}
                  >
                     Sign Up
                  </Button>
                  <Button
                     fullWidth
                     variant="outlined"
                     onClick={() => setIsSignUp(false)}
                     sx={{
                        borderColor: !isSignUp ? 'green' : '#c8e6c9',
                        color: !isSignUp ? 'green' : '#757575',
                        fontWeight: !isSignUp ? 600 : 400,
                     }}
                  >
                     Log In
                  </Button>
               </Box>

               <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                     mt: 3,
                     backgroundColor: 'green',
                     color: '#fff',
                     py: 1.2,
                     fontWeight: 'bold',
                     '&:hover': {
                        backgroundColor: '#2e7d32',
                     },
                  }}
               >
                  {isSignUp ? 'Register' : 'Login'}
               </Button>
            </Box>
         </MotionBox>
      </Box>
   );
};

export default AuthPage;
