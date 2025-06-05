import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard';
import ProjectsPage from './scenes/projects';
import FarmersPage from './scenes/farmers';
import InvestorsPage from './scenes/investors';
import TransactionPage from './scenes/transactions';
import InvestmentConfirmationPage from './scenes/investmentconfirmation';
import ContributorsPage from './scenes/contributors';
import Team from './scenes/team';
import Invoices from './scenes/invoices';
import Contacts from './scenes/contacts';
import Bar from './scenes/bar';
import Form from './scenes/form';
import Line from './scenes/line';
import Pie from './scenes/pie';
import FAQ from './scenes/faq';
import Geography from './scenes/geography';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import Calendar from './scenes/calendar/calendar';
import FundingProgressPage from './scenes/fundingprogress';
import RegionalPerformancePage from './scenes/regoinalPeformance';
import Auth from './scenes/auth';

function RequireAuth({ children }) {
   const token = localStorage.getItem('adminToken');
   const location = useLocation();
   if (!token) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }
   return children;
}

function App() {
   const [theme, colorMode] = useMode();
   const [isSidebar, setIsSidebar] = useState(true);

   return (
      <ColorModeContext.Provider value={colorMode}>
         <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
               <Routes>
                  <Route path="/login" element={<Auth />} />
                  <Route
                     path="/*"
                     element={
                        <RequireAuth>
                           <Sidebar isSidebar={isSidebar} />
                           <main className="content">
                              <Topbar setIsSidebar={setIsSidebar} />
                              <Routes>
                                 <Route path="/" element={<Dashboard />} />
                                 <Route path="/team" element={<Team />} />
                                 <Route
                                    path="/contacts"
                                    element={<Contacts />}
                                 />
                                 <Route
                                    path="/invoices"
                                    element={<Invoices />}
                                 />
                                 <Route path="/form" element={<Form />} />
                                 <Route path="/bar" element={<Bar />} />
                                 <Route path="/pie" element={<Pie />} />
                                 <Route path="/line" element={<Line />} />
                                 <Route
                                    path="/projects"
                                    element={<ProjectsPage />}
                                 />
                                 <Route
                                    path="/investment-confirmation"
                                    element={<InvestmentConfirmationPage />}
                                 />
                                 <Route
                                    path="/investors"
                                    element={<InvestorsPage />}
                                 />
                                 <Route
                                    path="/transactions"
                                    element={<TransactionPage />}
                                 />
                                 <Route
                                    path="/contributors"
                                    element={<ContributorsPage />}
                                 />
                                 <Route path="/faq" element={<FAQ />} />
                                 <Route
                                    path="/calendar"
                                    element={<Calendar />}
                                 />
                                 <Route
                                    path="/geography"
                                    element={<Geography />}
                                 />
                                 <Route
                                    path="/farmers"
                                    element={<FarmersPage />}
                                 />
                                 <Route
                                    path="/funding"
                                    element={<FundingProgressPage />}
                                 />
                                 <Route
                                    path="/regional"
                                    element={<RegionalPerformancePage />}
                                 />
                                 {/* Add other routes as needed */}
                              </Routes>
                           </main>
                        </RequireAuth>
                     }
                  />
               </Routes>
            </div>
         </ThemeProvider>
      </ColorModeContext.Provider>
   );
}

export default App;
