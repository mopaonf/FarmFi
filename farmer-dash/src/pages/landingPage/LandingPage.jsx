import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';

const LandingPage = () => {
   const navigate = useNavigate();

   return (
      <>
         <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box
               sx={{
                  backgroundColor: 'green',
                  color: '#fff',
                  py: 10,
                  textAlign: 'center',
               }}
            >
               <Typography variant="h3" fontWeight="bold" mb={2}>
                  Welcome to FarmFi
               </Typography>
               <Typography variant="h6" mb={4}>
                  Empowering farmers with financial solutions for a better
                  future.
               </Typography>
               <Button
                  variant="contained"
                  onClick={() => navigate('/auth')}
                  sx={{
                     backgroundColor: '#fff',
                     color: 'green',
                     px: 4,
                     py: 1.5,
                     fontWeight: 'bold',
                     '&:hover': {
                        backgroundColor: '#e0e0e0',
                     },
                  }}
               >
                  Get Started
               </Button>
            </Box>

            {/* Slider Section */}
            <Box
               sx={{
                  py: 10,
                  textAlign: 'center',
               }}
            >
               <Typography variant="h4" fontWeight="bold" mb={4}>
                  Our Features
               </Typography>
               <Box
                  sx={{
                     backgroundColor: '#e0e0e0',
                     height: 200,
                     borderRadius: 2,
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                  }}
               >
                  <Typography variant="body1" color="textSecondary">
                     [Slider Placeholder]
                  </Typography>
               </Box>
            </Box>
         </Box>
         <Footer />
      </>
   );
};

export default LandingPage;
