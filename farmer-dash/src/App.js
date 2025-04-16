import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeContainer from './pages/homeContainer';
import AuthPage from './pages/auth/index';
import LandingPage from './pages/landingPage/LandingPage';

const App = () => {
   return (
      <Router>
         <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/*" element={<HomeContainer />} />
         </Routes>
      </Router>
   );
};

export default App;
