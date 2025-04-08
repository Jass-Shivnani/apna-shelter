import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 4rem 5%;
  background-color: #f9f9f9;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 6.5rem;
  font-family: 'Roboto', sans-serif;
  color: #344767;
  margin-bottom: 2rem;
`;

const Description = styled.p`
  color: #344767;
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const Quote = styled.span`
  font-family: 'Europa Grotesk SH', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #344767;
`;

const WorkWithNGO = () => {
  return (
    <Section>
      <Title>Work with our NGO</Title>
      <Description>
        <Quote>"</Quote>The best way to find yourself is to lose yourself in the service of others<Quote>"</Quote>
      </Description>
    </Section>
  );
};

export default WorkWithNGO;
