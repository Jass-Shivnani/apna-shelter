import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 4rem 5%;
  background-color: #f9f9f9;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
`;

const Description = styled.p`
  color: #666;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const JoinButton = styled.button`
  background-color: #ff6b00;
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #e65c00;
  }
`;

const WorkWithNGO = () => {
  return (
    <Section>
      <Title>Work with our NGO</Title>
      <Description>
        We're constantly trying to express ourselves and actualize our dreams. If you have the 
        opportunity to play this game called life, you need to appreciate every moment.
      </Description>
      <JoinButton>Join Us</JoinButton>
    </Section>
  );
};

export default WorkWithNGO;
