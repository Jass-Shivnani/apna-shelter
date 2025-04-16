import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DonationImpact from './components/DonationImpact';
import UrgentNeed from './components/UrgentNeed';
import ImpactMap from './components/ImpactMap';
import WorkWithNGO from './components/WorkWithNGO';
import Footer from './components/Footer';
import DonationForm from './pages/DonationForm';
import ThankYou from './pages/ThankYou';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminDropLocations from './pages/AdminDropLocations';
import AdminUsers from './pages/AdminUsers';
import VolunteerManagement from './pages/VolunteerManagement';
import VolunteerManagementNew from './pages/VolunteerManagementNew';
import NgoApplication from './pages/NgoApplication';



const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const HomePageWrapper = styled.div`
  background-color: #FFF4E0;
`;

const HomePage = () => (
  <HomePageWrapper>
    <Navbar />
    <Hero />
    <DonationImpact />
    <UrgentNeed />
    <ImpactMap />
    <WorkWithNGO />
    <Footer />
  </HomePageWrapper>
);

// Protected route component for admin-only routes
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('userRole') === 'admin';
  const location = useLocation();
  
  return isAdmin ? children : <Navigate to="/admin/login" state={{ from: location }} replace />;
};

// Protected route component for manager or admin routes
const ManagerRoute = ({ children }) => {
  const userRole = localStorage.getItem('userRole');
  const isAuthorized = userRole === 'admin' || userRole === 'manager';
  const location = useLocation();
  
  return isAuthorized ? children : <Navigate to="/admin/login" state={{ from: location }} replace />;
};

// Protected route component for volunteer, manager or admin routes
const VolunteerRoute = ({ children }) => {
  const userRole = localStorage.getItem('userRole');
  const isAuthorized = userRole === 'admin' || userRole === 'manager' || userRole === 'volunteer';
  const location = useLocation();
  
  return isAuthorized ? children : <Navigate to="/admin/login" state={{ from: location }} replace />;
};

// Protected route component for any authenticated user
const ProtectedRoute = ({ children, allowedRoles = ['admin', 'manager', 'volunteer'] }) => {
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');
  const isAuthorized = allowedRoles.includes(userRole);
  const location = useLocation();
  
  return token && isAuthorized ? children : <Navigate to="/admin/login" state={{ from: location }} replace />;
};

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/donate" element={<DonationForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/drop-locations" element={<AdminRoute><AdminDropLocations /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        
        {/* Manager Routes */}
        <Route path="/admin/volunteers" element={
          <ProtectedRoute allowedRoles={['manager']}>
            <VolunteerManagementNew />
          </ProtectedRoute>
        } />
        <Route path="/admin/volunteers-old" element={
          <ProtectedRoute allowedRoles={['manager']}>
            <VolunteerManagement />
          </ProtectedRoute>
        } />
        
        {/* Volunteer Routes */}
        <Route path="/admin/ngo-application" element={<VolunteerRoute><NgoApplication /></VolunteerRoute>} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
