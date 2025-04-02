import React from 'react';
import styled from 'styled-components';

const HeroSection = styled.section`
  position: relative;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              url('/images/hero-bg.png') center/cover no-repeat;
  font-family: 'Roboto', sans-serif;
`;

const HeroContent = styled.div`
  animation: fadeIn 1s ease-in;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  font-size: 8rem;
  margin-bottom: 4rem;
  font-weight: 600;
  line-height: 0.8;
  text-align: left;
  font-family: 'Roboto';
  span {
    font-family: 'Europa Grotesk SH';
    display: block;
    text-align: right;
    color: #E85D04;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 4rem;
  line-height: 1.6;
  color: #f1f1f1;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const DonateButton = styled.button`
  background-color: #E85D04;
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
  font-family: 'Roboto', sans-serif;
  
  &:hover {
    background-color: #d04d1a;
  }
`;

const Hero = () => {
  return (
    <HeroSection>
      <HeroContent>
        <Title>
          Together, we can <span>end hunger!</span>
        </Title>
        <Subtitle>
          Join us in our mission to provide meals and hope to those in need. 
          Every donation makes a difference in someone's life.
        </Subtitle>
        <DonateButton>Donate Now</DonateButton>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;
