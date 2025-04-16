import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle, FaHome } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const ThankYou = () => {
  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <Card>
          <IconWrapper>
            <FaCheckCircle />
          </IconWrapper>
          <Title>Thank You for Your Donation!</Title>
          <Message>
            Your contribution will help feed those in need. We've received your donation details and will be in touch soon.
          </Message>
          <DetailMessage>
            You will receive a confirmation email with all the details of your donation. If you selected pickup, our team will contact you to arrange a convenient time.
          </DetailMessage>
          <ButtonContainer>
            <HomeButton to="/">
              <FaHome /> Return to Home
            </HomeButton>
          </ButtonContainer>
        </Card>
      </Container>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #FFF4E0;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
`;

const IconWrapper = styled.div`
  font-size: 5rem;
  color: #4CAF50;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #344767;
  margin-bottom: 1.5rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const DetailMessage = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const HomeButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #003669;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  text-decoration: none;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #002850;
  }
`;

export default ThankYou;
