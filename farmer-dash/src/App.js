import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import Projects from './pages/projects/Projects';
import SubmitProject from './pages/submitProjects/SubmitProject';
import Updates from './pages/updates/Updates';
import Wallet from './pages/wallet/Wallet';
import Profile from './pages/profile/Profile';

const App = () => {
   return (
      <Router>
         <Header />
         <Sidebar />
         <Box
            sx={{
               ml: '240px',
               mt: '64px',
               p: 3,
               backgroundColor: '#f8f9fa',
               minHeight: '100vh',
            }}
         >
            <Routes>
               <Route path="/" element={<Dashboard />} />
               <Route path="/projects" element={<Projects />} />
               <Route path="/submit-project" element={<SubmitProject />} />
               <Route path="/updates" element={<Updates />} />
               <Route path="/wallet" element={<Wallet />} />
               <Route path="/profile" element={<Profile />} />
            </Routes>
         </Box>
      </Router>
   );
};

export default App;
