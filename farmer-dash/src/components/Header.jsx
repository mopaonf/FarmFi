import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';

const Header = () => {
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
         </Toolbar>
      </AppBar>
   );
};

export default Header;
