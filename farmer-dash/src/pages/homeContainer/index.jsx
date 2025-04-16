import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Dashboard from '../dashboard/Dashboard';
import Projects from '../projects/Projects';
import SubmitProject from '../submitProjects/SubmitProject';
import Updates from '../updates/Updates';
import Wallet from '../wallet/Wallet';
import Profile from '../profile/Profile';

const HomeContainer = () => {
   return (
      <>
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
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/projects" element={<Projects />} />
               <Route path="/submit-project" element={<SubmitProject />} />
               <Route path="/updates" element={<Updates />} />
               <Route path="/wallet" element={<Wallet />} />
               <Route path="/profile" element={<Profile />} />
            </Routes>
         </Box>
         {/* <Footer /> */}
      </>
   );
};

export default HomeContainer;
