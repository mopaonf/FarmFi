import React, { useState } from 'react';
import {
   Box,
   Button,
   TextField,
   Typography,
   Paper,
   CircularProgress,
   Alert,
   useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Auth = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const navigate = useNavigate();

   const theme = useTheme();
   const colors = tokens(theme.palette.mode);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      try {
         const res = await fetch('http://localhost:5000/api/admins/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
         });
         const data = await res.json();
         console.log('Login Response:', data);

         if (!res.ok) {
            setError(data.message || 'Login failed');
            setLoading(false);
            return;
         }

         if (!data.admin) {
            setError('Admin data missing from response');
            setLoading(false);
            return;
         }

         localStorage.setItem('adminToken', data.token);
         localStorage.setItem('adminData', JSON.stringify(data.admin));
         navigate('/');
      } catch (err) {
         console.error('Login Error:', err); // Add error logging
         setError('Network error');
      }
      setLoading(false);
   };

   return (
      <Box
         minHeight="100vh"
         display="flex"
         flexDirection="column"
         alignItems="center"
         justifyContent="center"
         bgcolor={colors.primary[400]}
      >
         <Paper
            elevation={3}
            sx={{
               p: 4,
               width: '100%',
               maxWidth: 400,
               bgcolor: colors.primary[400],
               borderRadius: 2,
               border: `1px solid ${colors.grey[100]}`,
            }}
         >
            <Box
               display="flex"
               flexDirection="column"
               alignItems="center"
               mb={3}
            >
               <Box
                  sx={{
                     width: 60,
                     height: 60,
                     borderRadius: '50%',
                     bgcolor: colors.greenAccent[600],
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     mb: 2,
                  }}
               >
                  <LockOutlinedIcon fontSize="large" />
               </Box>
               <Typography
                  variant="h2"
                  fontWeight="bold"
                  color={colors.grey[100]}
               >
                  AgriVest Admin
               </Typography>
               <Typography
                  variant="body1"
                  color={colors.grey[300]}
                  sx={{ mt: 1 }}
               >
                  Enter your credentials to access the dashboard
               </Typography>
            </Box>

            {error && (
               <Alert
                  severity="error"
                  sx={{
                     mb: 2,
                     bgcolor: colors.redAccent[500],
                     color: 'white',
                  }}
               >
                  {error}
               </Alert>
            )}

            <form onSubmit={handleSubmit}>
               <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                     '& label': { color: colors.grey[300] },
                     '& input': { color: colors.grey[100] },
                     '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                           borderColor: colors.grey[500],
                        },
                        '&:hover fieldset': {
                           borderColor: colors.grey[100],
                        },
                     },
                  }}
               />
               <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                     '& label': { color: colors.grey[300] },
                     '& input': { color: colors.grey[100] },
                     '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                           borderColor: colors.grey[500],
                        },
                        '&:hover fieldset': {
                           borderColor: colors.grey[100],
                        },
                     },
                  }}
               />
               <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                     mt: 3,
                     mb: 2,
                     bgcolor: colors.greenAccent[600],
                     '&:hover': {
                        bgcolor: colors.greenAccent[700],
                     },
                     height: 48,
                  }}
               >
                  {loading ? (
                     <CircularProgress size={24} color="inherit" />
                  ) : (
                     'Sign In'
                  )}
               </Button>
            </form>
         </Paper>
      </Box>
   );
};

export default Auth;
