import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 4rem 5%;
`;

const Card = styled.div`
  display: grid;
  color: white;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  background-color: #003669;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ImageContainer = styled.div`
  line-height: 0;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const Content = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: left; 
`;


const Title = styled.h2`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1.5rem;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
`;

const Description = styled.p`
  color: white;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-weight: 200;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const DonateButton = styled(Button)`
  background-color: #ff6b00;
  color: white;
  border: none;
  
  &:hover {
    background-color: #e65c00;
  }
`;


const UrgentNeed = () => {
  return (
    <Section>
      <Card>
        <ImageContainer>
          <img src="/images/urgent-need.png" alt="Child in school uniform having a meal" />
        </ImageContainer>
        <Content>
          <Title>Provide Meals to Fight Hunger</Title>
          <Description>
            Your support will help us provide nutritious meals to those in need.
          </Description>
          <ButtonContainer> 
            <DonateButton>Donate now</DonateButton>
          </ButtonContainer>
        </Content>
      </Card>
    </Section>
  );
};

export default UrgentNeed;
