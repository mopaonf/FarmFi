import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthPage = () => {
   const [isSignUp, setIsSignUp] = useState(true);
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
   });
   const navigate = useNavigate();

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const url = isSignUp
         ? 'http://localhost:5000/api/farmers/signup'
         : 'http://localhost:5000/api/farmers/login';

      try {
         const response = await axios.post(url, formData);
         const { token } = response.data;

         // Save token to localStorage
         localStorage.setItem('token', token);

         // Navigate to dashboard on successful login
         if (!isSignUp) navigate('/dashboard');
         else alert('Signup successful! Please log in.');
      } catch (error) {
         alert(error.response?.data?.message || 'An error occurred');
      }
   };

   return (
      <Box
         sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
         }}
      >
         <Box
            sx={{
               width: '100%',
               maxWidth: 400,
               backgroundColor: '#fff',
               p: 4,
               borderRadius: 2,
               boxShadow: 3,
            }}
         >
            <Typography
               variant="h4"
               fontWeight="bold"
               textAlign="center"
               color="green"
               mb={2}
            >
               {isSignUp ? 'Sign Up' : 'Log In'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
               {isSignUp && (
                  <TextField
                     fullWidth
                     label="Name"
                     name="name"
                     variant="outlined"
                     margin="normal"
                     value={formData.name}
                     onChange={handleChange}
                  />
               )}
               <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  margin="normal"
                  value={formData.email}
                  onChange={handleChange}
               />
               <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={formData.password}
                  onChange={handleChange}
               />
               <Box
                  sx={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     mt: 3,
                  }}
               >
                  <Button
                     variant="contained"
                     color={isSignUp ? 'success' : 'inherit'}
                     onClick={() => setIsSignUp(true)}
                     sx={{
                        flex: 1,
                        mr: 1,
                        backgroundColor: isSignUp ? 'green' : '#e0e0e0',
                        color: isSignUp ? '#fff' : '#757575',
                     }}
                  >
                     Sign Up
                  </Button>
                  <Button
                     variant="contained"
                     color={!isSignUp ? 'success' : 'inherit'}
                     onClick={() => setIsSignUp(false)}
                     sx={{
                        flex: 1,
                        ml: 1,
                        backgroundColor: !isSignUp ? 'green' : '#e0e0e0',
                        color: !isSignUp ? '#fff' : '#757575',
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
                     '&:hover': {
                        backgroundColor: '#004d00',
                     },
                  }}
               >
                  {isSignUp ? 'Register' : 'Login'}
               </Button>
            </Box>
         </Box>
      </Box>
   );
};

export default AuthPage;
