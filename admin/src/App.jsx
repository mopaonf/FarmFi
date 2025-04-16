import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard';
import ProjectsPage from './scenes/projects';
import FarmersPage from './scenes/farmers';
import TransactionPage from './scenes/transactions';
import InvestorsPage from './scenes/investors';
import FundingProgressPage from './scenes/fundingprogress';

const App = () => {
   const [theme, colorMode] = useMode();

   return (
      <ColorModeContext.Provider value={colorMode}>
         <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
               <div style={{ display: 'flex', height: '100vh' }}>
                  <Sidebar />
                  <main style={{ flexGrow: 1, overflow: 'auto' }}>
                     <Topbar />
                     <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/farmers" element={<FarmersPage />} />
                        <Route path="/investors" element={<InvestorsPage />} />
                        <Route
                           path="/transactions"
                           element={<TransactionPage />}
                        />
                        <Route
                           path="/funding"
                           element={<FundingProgressPage />}
                        />
                        {/* Add other routes as needed */}
                     </Routes>
                  </main>
               </div>
            </Router>
         </ThemeProvider>
      </ColorModeContext.Provider>
   );
};

export default App;
