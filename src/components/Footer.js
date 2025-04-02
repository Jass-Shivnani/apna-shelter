import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #003366;
  color: white;
  padding: 4rem 5% 2rem;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    color: #ff6b00;
    margin-bottom: 1.5rem;
  }
`;

const FooterLink = styled.a`
  color: white;
  text-decoration: none;
  display: block;
  margin-bottom: 0.8rem;
  &:hover {
    color: #ff6b00;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  color: white;
  font-size: 1.5rem;
  &:hover {
    color: #ff6b00;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>About Us</h3>
          <FooterLink href="#">Our Story</FooterLink>
          <FooterLink href="#">Mission & Vision</FooterLink>
          <FooterLink href="#">Team</FooterLink>
          <FooterLink href="#">Partners</FooterLink>
        </FooterSection>

        <FooterSection>
          <h3>Get Involved</h3>
          <FooterLink href="#">Donate</FooterLink>
          <FooterLink href="#">Volunteer</FooterLink>
          <FooterLink href="#">Fundraise</FooterLink>
          <FooterLink href="#">Corporate Partnerships</FooterLink>
        </FooterSection>

        <FooterSection>
          <h3>Contact Us</h3>
          <FooterLink href="mailto:info@apnashelter.org">info@apnashelter.org</FooterLink>
          <FooterLink href="tel:+911234567890">+91 123 456 7890</FooterLink>
          <SocialLinks>
            <SocialIcon href="#"><FaFacebook /></SocialIcon>
            <SocialIcon href="#"><FaTwitter /></SocialIcon>
            <SocialIcon href="#"><FaInstagram /></SocialIcon>
            <SocialIcon href="#"><FaLinkedin /></SocialIcon>
          </SocialLinks>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        © {new Date().getFullYear()} Apna Shelter. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
