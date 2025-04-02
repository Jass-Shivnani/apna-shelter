import React from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Section = styled.section`
  padding: 4rem 5%;
  background-color: #003366;
  color: white;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  text-align: center;
`;

const StatBox = styled.div`
  padding: 2rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff6b00;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #ffffff;
  font-size: 1.1rem;
`;

const MapWrapper = styled.div`
  height: 400px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;

const ImpactMap = () => {
  const stats = [
    { number: '262,738,798', label: 'meals served' },
    { number: '1,780,655', label: 'supporters' },
    { number: '127', label: 'NGOs' }
  ];

  return (
    <Section>
      <Title>Our Impact to date</Title>
      <StatsContainer>
        {stats.map((stat, index) => (
          <StatBox key={index}>
            <StatNumber>{stat.number}</StatNumber>
            <StatLabel>{stat.label}</StatLabel>
          </StatBox>
        ))}
      </StatsContainer>
      <MapWrapper>
        <MapContainer
          center={[20.5937, 78.9629]} // Center of India
          zoom={5}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Add markers for impact locations */}
        </MapContainer>
      </MapWrapper>
    </Section>
  );
};

export default ImpactMap;
