import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import axios from 'axios';

const Header = () => {
   const [userName, setUserName] = useState('');

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
            setUserName(response.data.name); // Dynamically set the user's name
         } catch (error) {
            console.error('Error fetching profile:', error);
         }
      };
      fetchProfile();
   }, []);

   return (
      <AppBar
         position="fixed"
         elevation={0}
         sx={{
            backgroundColor: '#2e7d32',
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
         }}
      >
         <Toolbar>
            <Box display="flex" alignItems="center" gap={1}>
               <AgricultureIcon sx={{ fontSize: 32 }} />
               <Typography
                  variant="h5"
                  component="div"
                  noWrap
                  sx={{ fontWeight: 600 }}
               >
                  FarmFi
               </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
               {userName}
            </Typography>
         </Toolbar>
      </AppBar>
   );
};

export default Header;
