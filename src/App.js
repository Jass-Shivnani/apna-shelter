import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DonationImpact from './components/DonationImpact';
import UrgentNeed from './components/UrgentNeed';
import ImpactMap from './components/ImpactMap';
import WorkWithNGO from './components/WorkWithNGO';
import Footer from './components/Footer';
import DonationForm from './pages/DonationForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

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

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/donate" element={<DonationForm />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
