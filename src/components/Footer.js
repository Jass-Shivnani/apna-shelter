import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #003669;
  color: white;
  padding: 4rem 5% 2rem;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  max-width: 1400px;
  margin: 0 10%;
  gap: 4rem;
`;

const ContactSection = styled.div`
  h3 {
    font-size: 2rem;
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
  }
`;

const ContactLink = styled.a`
  color: white;
  text-decoration: none;
  display: block;
  margin: 0.8rem 0;
  font-size: 1.2rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4CAF50;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
`;

const SocialIcon = styled.a`
  color: white;
  font-size: 1.8rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4CAF50;
  }
`;

const Logo = styled.img`
  width: 300px;
  height: auto;
`;

const Copyright = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <ContactSection>
          <h3>Contact Us</h3>
          <ContactLink href="mailto:info@apnashelter.org">info@apnashelter.org</ContactLink>
          <ContactLink href="tel:+911234567890">+91 123 456 7890</ContactLink>
          <SocialLinks>
            <SocialIcon href="#" aria-label="Facebook"><FaFacebook /></SocialIcon>
            <SocialIcon href="#" aria-label="Twitter"><FaTwitter /></SocialIcon>
            <SocialIcon href="#" aria-label="Instagram"><FaInstagram /></SocialIcon>
          </SocialLinks>
        </ContactSection>

        <Logo src="/images/logo2.png" alt="Apna Shelter Logo" />

        <Copyright>
          &copy; {new Date().getFullYear()} Apna Shelter India Foundation. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
