import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const scroll = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const TopBanner = styled.div`
  background-color: #1D3557;
  color: white;
  padding: 1rem;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
`;

const ScrollingText = styled.div`
  display: inline-block;
  animation: ${scroll} 20s linear infinite;
  padding-left: 100%;
`;

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2.5%;
  background-color: #FFF4E0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-family: 'Roboto', sans-serif;
`;

const Logo = styled.div`
  img {
    height: 70px;
    width: auto;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const AdminTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: #1B1C1E;
  font-family: 'Roboto', sans-serif;
`;

const AdminNavbar = () => {
  return (
    <>
      <TopBanner>
        <ScrollingText>
          🚀 Donations to Apna Shelter India Foundation are eligible for 50% tax exemption under Section 80G of Indian Income Tax Act. Support Our Campaigns and save on taxes! 🚀
        </ScrollingText>
      </TopBanner>
      <Nav>
        <Logo>
          <img src="/images/logo.png" alt="APNA SHELTER INDIA FOUNDATION - A NEW HOPE FOR NEW FUTURE" />
        </Logo>
        <NavLinks>
          <AdminTitle>Admin Portal</AdminTitle>
        </NavLinks>
      </Nav>
    </>
  );
};

export default AdminNavbar;
