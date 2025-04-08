import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #F8F9FA;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #344767;
  font-family: 'Roboto', sans-serif;
`;

const LogoutButton = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#007DBC' : 'transparent'};
  color: ${props => props.active ? '#007DBC' : '#666'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #007DBC;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  border-bottom: 1px solid #dee2e6;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  
  background-color: ${props => {
    switch(props.status) {
      case 'pending': return '#FFF3CD';
      case 'approved': return '#D1E7DD';
      case 'completed': return '#CFF4FC';
      case 'rejected': return '#F8D7DA';
      default: return '#E2E3E5';
    }
  }};
  
  color: ${props => {
    switch(props.status) {
      case 'pending': return '#856404';
      case 'approved': return '#0F5132';
      case 'completed': return '#055160';
      case 'rejected': return '#842029';
      default: return '#41464B';
    }
  }};
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 0.5rem;
  
  background-color: ${props => {
    switch(props.action) {
      case 'view': return '#E9ECEF';
      case 'approve': return '#D1E7DD';
      case 'reject': return '#F8D7DA';
      case 'complete': return '#CFF4FC';
      default: return '#E2E3E5';
    }
  }};
  
  color: ${props => {
    switch(props.action) {
      case 'view': return '#495057';
      case 'approve': return '#0F5132';
      case 'reject': return '#842029';
      case 'complete': return '#055160';
      default: return '#41464B';
    }
  }};
  
  border: 1px solid ${props => {
    switch(props.action) {
      case 'view': return '#CED4DA';
      case 'approve': return '#A3CFBB';
      case 'reject': return '#F1AEB5';
      case 'complete': return '#9EEAF9';
      default: return '#D6D8DB';
    }
  }};
  
  &:hover {
    opacity: 0.8;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
`;

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  flex: 1;
  
  &:focus {
    outline: none;
    border-color: #007DBC;
  }
`;

const FilterSelect = styled.select`
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #007DBC;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #dee2e6;
  background-color: ${props => props.active ? '#007DBC' : 'white'};
  color: ${props => props.active ? 'white' : '#495057'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#007DBC' : '#f8f9fa'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #344767;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #343a40;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const DetailItem = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailLabel = styled.p`
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.p`
  font-size: 1rem;
  color: #212529;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const MapContainer = styled.div`
  height: 300px;
  margin-top: 0.5rem;
  border-radius: 4px;
  overflow: hidden;
`;

const ModalFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

// Mock data for demonstration
const mockDonations = [
  {
    id: '123456',
    fullName: 'Rahul Sharma',
    contactNumber: '9876543210',
    date: '2025-04-02',
    items: 'Rice, dal, and vegetables for 5 people',
    deliveryMethod: 'pickup',
    status: 'pending',
    address: '123 Main Street, Mumbai',
    pinCode: '400001',
    city: 'Mumbai',
    state: 'Maharashtra',
    photoVerification: '/images/mock-donation.jpg',
    notes: 'Available for pickup on weekends'
  },
  {
    id: '123457',
    fullName: 'Priya Patel',
    contactNumber: '9876543211',
    date: '2025-04-01',
    items: 'Homemade chapatis and curry for 10 people',
    deliveryMethod: 'drop',
    status: 'approved',
    selectedDropLocation: {
      name: 'Apna Shelter Main Center',
      address: '123 Charity Road, Mumbai',
      timings: '10:00 AM - 6:00 PM'
    },
    pinCode: '400002',
    photoVerification: '/images/mock-donation2.jpg'
  },
  {
    id: '123458',
    fullName: 'Amit Kumar',
    contactNumber: '9876543212',
    date: '2025-03-30',
    items: 'Packed meals with rice, dal, and sabzi for 8 people',
    deliveryMethod: 'pickup',
    status: 'completed',
    address: '456 Park Avenue, Delhi',
    pinCode: '110001',
    city: 'Delhi',
    state: 'Delhi',
    photoVerification: '/images/mock-donation3.jpg'
  },
  {
    id: '123459',
    fullName: 'Sneha Gupta',
    contactNumber: '9876543213',
    date: '2025-03-29',
    items: 'Bread, fruits, and dry snacks for 15 people',
    deliveryMethod: 'drop',
    status: 'rejected',
    selectedDropLocation: {
      name: 'Apna Shelter South Center',
      address: '456 Hope Street, Mumbai',
      timings: '9:00 AM - 5:00 PM'
    },
    pinCode: '400003',
    photoVerification: '/images/mock-donation4.jpg',
    notes: 'Food items are past expiration date'
  }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Check if admin is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Load donations data
  useEffect(() => {
    // In a real app, this would be an API call to fetch donations
    // For demo purposes, we'll use our mock data
    setDonations(mockDonations);
  }, []);

  // Filter donations based on active tab, search term, and status filter
  useEffect(() => {
    let filtered = [...donations];
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(donation => donation.deliveryMethod === activeTab);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(donation => donation.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(donation => 
        donation.fullName.toLowerCase().includes(term) ||
        donation.id.includes(term) ||
        donation.pinCode.includes(term) ||
        donation.contactNumber.includes(term)
      );
    }
    
    setFilteredDonations(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeTab, donations, searchTerm, statusFilter]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin/login');
  };

  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const handleStatusChange = (donationId, newStatus) => {
    // In a real app, this would be an API call to update the donation status
    const updatedDonations = donations.map(donation => 
      donation.id === donationId ? { ...donation, status: newStatus } : donation
    );
    setDonations(updatedDonations);
    
    if (selectedDonation && selectedDonation.id === donationId) {
      setSelectedDonation({ ...selectedDonation, status: newStatus });
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDonations = filteredDonations.slice(startIndex, startIndex + itemsPerPage);

  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <DashboardHeader>
          <Title>Admin Dashboard</Title>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </DashboardHeader>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'all'} 
            onClick={() => setActiveTab('all')}
          >
            All Donations
          </Tab>
          <Tab 
            active={activeTab === 'pickup'} 
            onClick={() => setActiveTab('pickup')}
          >
            Pickup Requests
          </Tab>
          <Tab 
            active={activeTab === 'drop'} 
            onClick={() => setActiveTab('drop')}
          >
            Drop-off Donations
          </Tab>
        </TabsContainer>
        
        <SearchContainer>
          <SearchInput 
            type="text" 
            placeholder="Search by name, ID, pincode, or phone number" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </FilterSelect>
        </SearchContainer>
        
        <Card>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Name</Th>
                  <Th>Date</Th>
                  <Th>Food Description</Th>
                  <Th>Method</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {paginatedDonations.length > 0 ? (
                  paginatedDonations.map(donation => (
                    <tr key={donation.id}>
                      <Td>#{donation.id}</Td>
                      <Td>{donation.fullName}</Td>
                      <Td>{new Date(donation.date).toLocaleDateString()}</Td>
                      <Td>{donation.items.length > 30 ? `${donation.items.substring(0, 30)}...` : donation.items}</Td>
                      <Td>{donation.deliveryMethod === 'pickup' ? 'Pickup' : 'Drop-off'}</Td>
                      <Td>
                        <StatusBadge status={donation.status}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </StatusBadge>
                      </Td>
                      <Td>
                        <ActionButton 
                          action="view"
                          onClick={() => handleViewDonation(donation)}
                        >
                          View
                        </ActionButton>
                        
                        {donation.status === 'pending' && (
                          <>
                            <ActionButton 
                              action="approve"
                              onClick={() => handleStatusChange(donation.id, 'approved')}
                            >
                              Approve
                            </ActionButton>
                            <ActionButton 
                              action="reject"
                              onClick={() => handleStatusChange(donation.id, 'rejected')}
                            >
                              Reject
                            </ActionButton>
                          </>
                        )}
                        
                        {donation.status === 'approved' && (
                          <ActionButton 
                            action="complete"
                            onClick={() => handleStatusChange(donation.id, 'completed')}
                          >
                            Complete
                          </ActionButton>
                        )}
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <Td colSpan="7">
                      <EmptyState>
                        No donations found matching your filters.
                      </EmptyState>
                    </Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableContainer>
          
          {totalPages > 1 && (
            <Pagination>
              <PageButton 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </PageButton>
              
              {[...Array(totalPages)].map((_, index) => (
                <PageButton 
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PageButton>
              ))}
              
              <PageButton 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </PageButton>
            </Pagination>
          )}
        </Card>
      </Container>
      
      {/* Donation Details Modal */}
      {showModal && selectedDonation && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Donation Details #{selectedDonation.id}</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <StatusBadge status={selectedDonation.status}>
                  {selectedDonation.status.charAt(0).toUpperCase() + selectedDonation.status.slice(1)}
                </StatusBadge>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Donor Name</DetailLabel>
                <DetailValue>{selectedDonation.fullName}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Contact Number</DetailLabel>
                <DetailValue>+91 {selectedDonation.contactNumber}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Date Submitted</DetailLabel>
                <DetailValue>{new Date(selectedDonation.date).toLocaleDateString()}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Donation Method</DetailLabel>
                <DetailValue>{selectedDonation.deliveryMethod === 'pickup' ? 'Pickup' : 'Drop-off'}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Pin Code</DetailLabel>
                <DetailValue>{selectedDonation.pinCode}</DetailValue>
              </DetailItem>
              
              {selectedDonation.deliveryMethod === 'pickup' ? (
                <>
                  <DetailItem>
                    <DetailLabel>Address</DetailLabel>
                    <DetailValue>{selectedDonation.address}</DetailValue>
                  </DetailItem>
                  
                  {selectedDonation.landmark && (
                    <DetailItem>
                      <DetailLabel>Landmark</DetailLabel>
                      <DetailValue>{selectedDonation.landmark}</DetailValue>
                    </DetailItem>
                  )}
                  
                  <DetailItem>
                    <DetailLabel>City</DetailLabel>
                    <DetailValue>{selectedDonation.city}</DetailValue>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailLabel>State</DetailLabel>
                    <DetailValue>{selectedDonation.state}</DetailValue>
                  </DetailItem>
                </>
              ) : (
                <DetailItem>
                  <DetailLabel>Selected Drop Location</DetailLabel>
                  <DetailValue>
                    {selectedDonation.selectedDropLocation?.name}<br />
                    {selectedDonation.selectedDropLocation?.address}<br />
                    Open: {selectedDonation.selectedDropLocation?.timings}
                  </DetailValue>
                </DetailItem>
              )}
              
              <DetailItem>
                <DetailLabel>Food Description</DetailLabel>
                <DetailValue>{selectedDonation.items}</DetailValue>
              </DetailItem>
              
              {selectedDonation.notes && (
                <DetailItem>
                  <DetailLabel>Additional Notes</DetailLabel>
                  <DetailValue>{selectedDonation.notes}</DetailValue>
                </DetailItem>
              )}
              
              <DetailItem>
                <DetailLabel>Photo Verification</DetailLabel>
                <ImagePreview src={selectedDonation.photoVerification} alt="Donation items" />
              </DetailItem>
            </ModalBody>
            <ModalFooter>
              {selectedDonation.status === 'pending' && (
                <>
                  <ActionButton 
                    action="approve"
                    onClick={() => handleStatusChange(selectedDonation.id, 'approved')}
                  >
                    Approve
                  </ActionButton>
                  <ActionButton 
                    action="reject"
                    onClick={() => handleStatusChange(selectedDonation.id, 'rejected')}
                  >
                    Reject
                  </ActionButton>
                </>
              )}
              
              {selectedDonation.status === 'approved' && (
                <ActionButton 
                  action="complete"
                  onClick={() => handleStatusChange(selectedDonation.id, 'completed')}
                >
                  Complete
                </ActionButton>
              )}
              
              <ActionButton 
                action="view"
                onClick={() => setShowModal(false)}
              >
                Close
              </ActionButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default AdminDashboard;
