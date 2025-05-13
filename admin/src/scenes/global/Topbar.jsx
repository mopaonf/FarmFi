import {
   Box,
   IconButton,
   useTheme,
   Menu,
   MenuItem,
   Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext, tokens } from '../../theme';
import InputBase from '@mui/material/InputBase';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const Topbar = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const colorMode = useContext(ColorModeContext);
   const navigate = useNavigate();
   const [anchorEl, setAnchorEl] = useState(null);
   const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

   const handleProfileClick = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const handleLogout = () => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      navigate('/login');
      handleClose();
   };

   return (
      <Box display="flex" justifyContent="space-between" p={2}>
         {/* SEARCH BAR */}
         <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
         >
            <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
            <IconButton type="button" sx={{ p: 1 }}>
               <SearchIcon />
            </IconButton>
         </Box>

         {/* ICONS */}
         <Box display="flex">
            <IconButton onClick={colorMode.toggleColorMode}>
               {theme.palette.mode === 'dark' ? (
                  <DarkModeOutlinedIcon />
               ) : (
                  <LightModeOutlinedIcon />
               )}
            </IconButton>
            <IconButton>
               <NotificationsOutlinedIcon />
            </IconButton>
            <IconButton>
               <SettingsOutlinedIcon />
            </IconButton>
            <IconButton onClick={handleProfileClick}>
               <PersonOutlinedIcon />
            </IconButton>
            <Menu
               anchorEl={anchorEl}
               open={Boolean(anchorEl)}
               onClose={handleClose}
               anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
               }}
               transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
               }}
               PaperProps={{
                  sx: {
                     backgroundColor: colors.primary[400],
                     color: colors.grey[100],
                     mt: '8px',
                  },
               }}
            >
               <Box
                  sx={{ p: 2, borderBottom: `1px solid ${colors.grey[500]}` }}
               >
                  <Typography variant="body1" fontWeight="bold">
                     {adminData.name || 'Admin'}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]}>
                     {adminData.email}
                  </Typography>
               </Box>
               <MenuItem
                  onClick={handleClose}
                  sx={{
                     display: 'flex',
                     gap: '8px',
                     '&:hover': { backgroundColor: colors.primary[500] },
                  }}
               >
                  <AccountCircleOutlinedIcon />
                  Profile
               </MenuItem>
               <MenuItem
                  onClick={handleLogout}
                  sx={{
                     display: 'flex',
                     gap: '8px',
                     color: colors.redAccent[500],
                     '&:hover': { backgroundColor: colors.primary[500] },
                  }}
               >
                  <LogoutOutlinedIcon />
                  Logout
               </MenuItem>
            </Menu>
         </Box>
      </Box>
   );
};

export default Topbar;
