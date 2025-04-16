import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
   return (
      <Box
         component="footer"
         sx={{
            backgroundColor: 'green',
            color: '#fff',
            py: 3,
            textAlign: 'center',
         }}
      >
         <Typography variant="body1" mb={2}>
            &copy; 2023 FarmFi. All rights reserved.
         </Typography>
         <Box
            sx={{
               display: 'flex',
               justifyContent: 'center',
               gap: 3,
            }}
         >
            <Link href="/about" color="inherit" underline="hover">
               About Us
            </Link>
            <Link href="/contact" color="inherit" underline="hover">
               Contact
            </Link>
            <Link href="/privacy" color="inherit" underline="hover">
               Privacy Policy
            </Link>
         </Box>
      </Box>
   );
};

export default Footer;
