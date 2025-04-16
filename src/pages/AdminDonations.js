import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { donationService } from '../services/api';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f5f7fa;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #344767;
  font-size: 2rem;
`;

const DonationsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DonationCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  border-left: 4px solid ${props => {
    switch(props.status) {
      case 'confirmed': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#ff5252';
      default: return '#FFC107'; // pending
    }
  }};
  
  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const DonationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const DonationName = styled.h3`
  color: #344767;
  margin: 0;
  font-size: 1.2rem;
`;

const DonationStatus = styled.span`
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  background: ${props => {
    switch(props.status) {
      case 'confirmed': return '#e8f5e9';
      case 'completed': return '#e3f2fd';
      case 'cancelled': return '#ffebee';
      default: return '#fff8e1'; // pending
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'confirmed': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#ff5252';
      default: return '#FFC107'; // pending
    }
  }};
`;

const DonationDetails = styled.div`
  margin-bottom: 1rem;
`;

const DonationDetail = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  
  svg {
    margin-right: 0.5rem;
    margin-top: 0.2rem;
    color: #666;
  }
`;

const DonationActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.color || '#666'};
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const FoodItemsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0.5rem 0;
`;

const FoodItem = styled.li`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.2rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #344767;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: white;
  color: #666;
  border: 1px solid #ddd;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const ConfirmButton = styled(Button)`
  background: ${props => props.color || '#007DBC'};
  color: white;
  border: none;
  
  &:hover {
    background: ${props => {
      switch(props.color) {
        case '#4CAF50': return '#3d8b40';
        case '#ff5252': return '#e04848';
        default: return '#0069a3';
      }
    }};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
`;

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  
  // Fetch all donations
  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await donationService.getAllDonations();
      if (response.success) {
        setDonations(response.data);
      } else {
        alert('Error fetching donations');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      alert('Error fetching donations');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDonations();
  }, []);
  
  // Open modal for donation action
  const handleActionClick = (donation, action) => {
    setSelectedDonation(donation);
    setSelectedAction(action);
    setShowModal(true);
  };
  
  // Handle donation status update
  const handleUpdateStatus = async () => {
    if (!selectedDonation || !selectedAction) return;
    
    try {
      let newStatus;
      switch (selectedAction) {
        case 'confirm':
          newStatus = 'confirmed';
          break;
        case 'complete':
          newStatus = 'completed';
          break;
        case 'cancel':
          newStatus = 'cancelled';
          break;
        default:
          return;
      }
      
      const response = await donationService.updateDonationStatus(selectedDonation._id, newStatus);
      
      if (response.success) {
        setShowModal(false);
        fetchDonations();
      } else {
        alert(response.message || 'Error updating donation status');
      }
    } catch (error) {
      console.error('Error updating donation status:', error);
      alert('Error updating donation status');
    }
  };
  
  // Get action button text and color
  const getActionDetails = (action) => {
    switch (action) {
      case 'confirm':
        return { text: 'Confirm', color: '#4CAF50' };
      case 'complete':
        return { text: 'Complete', color: '#2196F3' };
      case 'cancel':
        return { text: 'Cancel', color: '#ff5252' };
      default:
        return { text: 'Update', color: '#007DBC' };
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <PageHeader>
          <Title>Manage Donations</Title>
        </PageHeader>
        
        {loading ? (
          <LoadingMessage>Loading donations...</LoadingMessage>
        ) : donations.length === 0 ? (
          <EmptyMessage>No donations found</EmptyMessage>
        ) : (
          <DonationsGrid>
            {donations.map(donation => (
              <DonationCard key={donation._id} status={donation.status}>
                <DonationHeader>
                  <DonationName>{donation.name}</DonationName>
                  <DonationStatus status={donation.status}>
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </DonationStatus>
                </DonationHeader>
                
                <DonationDetails>
                  <DonationDetail>
                    <FaInfoCircle />
                    <div>
                      <div>{donation.email}</div>
                      <div>{donation.phone}</div>
                      <div>Type: {donation.donationType === 'pickup' ? 'Pickup' : 'Drop-off'}</div>
                      <div>Date: {formatDate(donation.createdAt)}</div>
                    </div>
                  </DonationDetail>
                  
                  {donation.donationType === 'pickup' ? (
                    <DonationDetail>
                      <FaMapMarkerAlt />
                      <div>
                        <div>{donation.address}</div>
                        {donation.landmark && <div>Landmark: {donation.landmark}</div>}
                        <div>{donation.city}, {donation.state}</div>
                        <div>PIN: {donation.pinCode}</div>
                      </div>
                    </DonationDetail>
                  ) : (
                    <DonationDetail>
                      <FaMapMarkerAlt />
                      <div>Drop Location ID: {donation.dropLocationId}</div>
                    </DonationDetail>
                  )}
                  
                  <DonationDetail>
                    <FaUtensils />
                    <div>
                      <div>Food Items:</div>
                      <FoodItemsList>
                        {donation.foodItems.map((item, index) => (
                          <FoodItem key={index}>
                            {item.name} - {item.quantity} {item.unit}
                          </FoodItem>
                        ))}
                      </FoodItemsList>
                    </div>
                  </DonationDetail>
                </DonationDetails>
                
                <DonationActions>
                  {donation.status === 'pending' && (
                    <>
                      <ActionButton 
                        onClick={() => handleActionClick(donation, 'confirm')}
                        color="#4CAF50"
                        title="Confirm Donation"
                      >
                        <FaCheckCircle size={18} />
                      </ActionButton>
                      <ActionButton 
                        onClick={() => handleActionClick(donation, 'cancel')}
                        color="#ff5252"
                        title="Cancel Donation"
                      >
                        <FaTimesCircle size={18} />
                      </ActionButton>
                    </>
                  )}
                  
                  {donation.status === 'confirmed' && (
                    <ActionButton 
                      onClick={() => handleActionClick(donation, 'complete')}
                      color="#2196F3"
                      title="Mark as Completed"
                    >
                      <FaCheckCircle size={18} />
                    </ActionButton>
                  )}
                </DonationActions>
              </DonationCard>
            ))}
          </DonationsGrid>
        )}
      </Container>
      
      {/* Confirmation Modal */}
      {showModal && selectedDonation && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {getActionDetails(selectedAction).text} Donation
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <p>
              Are you sure you want to {selectedAction} the donation from <strong>{selectedDonation.name}</strong>?
            </p>
            
            <ModalActions>
              <CancelButton onClick={() => setShowModal(false)}>
                Cancel
              </CancelButton>
              <ConfirmButton 
                onClick={handleUpdateStatus}
                color={getActionDetails(selectedAction).color}
              >
                {getActionDetails(selectedAction).text}
              </ConfirmButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </PageWrapper>
  );
};

export default AdminDonations;
