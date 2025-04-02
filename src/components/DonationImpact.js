import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 4rem 5%;
  background-color: #f9f9f9;
  text-align: left;
`;

const Title = styled.h1`
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 88.32px;
  color: #344767;
  font-weight: bold;
  width: 100%;
  margin-bottom: 48px;
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
  justify-content: center;
`;

const SmallCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 340px);
  grid-template-rows: repeat(2, 220px);
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 7px solid #344767;
`;

const SmallCard = styled(Card)`
  text-align: left;
  width: 297px;
  height: 192px;
`;

const LargeCard = styled(Card)`
  width: 700px;
  height: 470px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px;

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 16px;
  }
`;

const CardTitle = styled.h3`
  color: #1D3557;
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: 650;
`;

const CardText = styled.p`
  color: #666;
  line-height: 1.5;
  font-size: 14px;
`;

const DonationImpact = () => {
  return (
    <Section>
      <Title>How your donation helps?</Title>
      <CardsContainer>
        <SmallCardsGrid>
          <SmallCard>
            <CardTitle>Fight Hunger & Save Lives</CardTitle>
            <CardText>
              Your donation provides nutritious meals to underprivileged families,
              ensuring no one sleeps hungry.
            </CardText>
          </SmallCard>
          <SmallCard>
            <CardTitle>Make a Direct Impact</CardTitle>
            <CardText>
              Every contribution directly supports feeding programs, making an
              immediate difference in people’s lives.
            </CardText>
          </SmallCard>
          <SmallCard>
            <CardTitle>Spread Kindness & Hope</CardTitle>
            <CardText>
              Your generosity not only provides food but also restores hope and
              dignity to the less fortunate.
            </CardText>
          </SmallCard>
          <SmallCard>
            <CardTitle>Support a Trusted Cause</CardTitle>
            <CardText>
              Apna Shelter India Foundation is committed to transparency,
              ensuring your donation is used effectively for those in need.
            </CardText>
          </SmallCard>
        </SmallCardsGrid>
        <LargeCard>
          <img src="/images/features.png" alt="Children enjoying a meal" />
          <CardTitle>Tax Benefits & Social Responsibility</CardTitle>
          <CardText>
            Donations are tax-exempt and help you contribute to social welfare,
            fulfilling your duty to give back to society.
          </CardText>
        </LargeCard>
      </CardsContainer>
    </Section>
  );
};

export default DonationImpact;
