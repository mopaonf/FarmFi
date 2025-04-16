import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import AddBoxIcon from '@mui/icons-material/AddBox';
import UpdateIcon from '@mui/icons-material/Update';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';

const menuItems = [
   { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
   { text: 'My Projects', icon: <FolderIcon />, path: '/projects' },
   { text: 'Submit Project', icon: <AddBoxIcon />, path: '/submit-project' },
   { text: 'Post Update', icon: <UpdateIcon />, path: '/updates' },
   { text: 'Wallet', icon: <AccountBalanceWalletIcon />, path: '/wallet' },
   { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const Sidebar = () => {
   return (
      <Box
         sx={{
            width: 240,
            backgroundColor: '#fff',
            borderRight: '1px solid #e0e0e0',
            height: '100vh',
            position: 'fixed',
            top: 64,
            left: 0,
         }}
      >
         <List>
            {menuItems.map((item) => (
               <ListItem
                  key={item.text}
                  component={NavLink}
                  to={item.path}
                  sx={{
                     color: '#666',
                     '&.active': {
                        color: '#2e7d32',
                        backgroundColor: '#f0f7f0',
                        borderRight: '3px solid #2e7d32',
                     },
                     '&:hover': {
                        backgroundColor: '#f5f5f5',
                     },
                  }}
               >
                  <ListItemIcon
                     sx={{
                        color: 'inherit',
                        minWidth: 40,
                     }}
                  >
                     {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
               </ListItem>
            ))}
         </List>
      </Box>
   );
};

export default Sidebar;
