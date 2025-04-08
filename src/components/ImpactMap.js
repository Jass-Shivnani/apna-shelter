import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 4rem 5%;
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const MapContainer = styled.div`
  line-height: 0;
  img {
    width: 100%;
    display: block;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const StatMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatNumber = styled.span`
  font-size: 2.5rem;
  font-weight: bold;
  color: #003669;
  line-height: 1;
`;

const StatLabel = styled.span`
  font-size: 1rem;
  color: #666;
`;

const GreenText = styled.span`
  color: #4CAF50;
  font-size: 0.875rem;
  text-align: right;
  white-space: nowrap;
  margin-top: 0.5rem;
`;

const Content = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #003669;
  height: 100%;
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

const ImpactMap = () => {
  return (
    <Section>
      <Card>
        <LeftSection>
          <MapContainer>
            <img src="/images/Mumbai.png" alt="Impact distribution map" />
          </MapContainer>
          <StatsContainer>
            <StatItem>
              <StatMain>
                <StatNumber>262,738,798 meals</StatNumber>
                <StatLabel>shared</StatLabel>
              </StatMain>
              <GreenText>+ 361,635<br />in the last day</GreenText>
            </StatItem>
            <StatItem>
              <StatMain>
                <StatNumber>1,789,655</StatNumber>
                <StatLabel>fighting hunger</StatLabel>
              </StatMain>
              <GreenText>+ 17,154<br />in the last day</GreenText>
            </StatItem>
            <StatItem>
              <StatMain>
                <StatNumber>127</StatNumber>
                <StatLabel>goals</StatLabel>
              </StatMain>
              <GreenText>+ 1<br />in the last 90 days</GreenText>
            </StatItem>
          </StatsContainer>
        </LeftSection>
        <Content>
          <Title>Our impact to date</Title>
          <Description>
            ShareTheMeal donations not only provide life-saving food in emergencies but also facilitate school feeding, nutrition support, cash transfers and resilience programmes all over the world.
          </Description>
        </Content>
      </Card>
    </Section>
  );
};

export default ImpactMap;
