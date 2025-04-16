import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { donationService } from '../services/api';
import { FaBoxOpen, FaCheckCircle, FaTimesCircle, FaSpinner, FaSearch, FaDirections, FaMapMarkedAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionLink = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: #007DBC;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #0069a3;
  }
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
      case 'confirmed': return '#D1E7DD';
      case 'completed': return '#CFF4FC';
      case 'cancelled': return '#F8D7DA';
      default: return '#E2E3E5';
    }
  }};
  
  color: ${props => {
    switch(props.status) {
      case 'pending': return '#856404';
      case 'confirmed': return '#0F5132';
      case 'completed': return '#055160';
      case 'cancelled': return '#842029';
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
      case 'accept': return '#28A745';
      default: return '#E2E3E5';
    }
  }};
  
  color: ${props => {
    switch(props.action) {
      case 'view': return '#495057';
      case 'approve': return '#0F5132';
      case 'reject': return '#842029';
      case 'complete': return '#055160';
      case 'accept': return '#fff';
      default: return '#41464B';
    }
  }};
  
  border: 1px solid ${props => {
    switch(props.action) {
      case 'view': return '#CED4DA';
      case 'approve': return '#A3CFBB';
      case 'reject': return '#F1AEB5';
      case 'complete': return '#9EEAF9';
      case 'accept': return '#28A745';
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

const DashboardStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  svg {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: ${props => props.color || '#007DBC'};
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #344767;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  
  svg {
    color: #007DBC;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  position: relative;
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
  }
`;

const SearchInput = styled.input`
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007DBC;
    box-shadow: 0 0 0 2px rgba(0, 125, 188, 0.2);
  }
`;

const FilterSelect = styled.select`
  padding: 0.6rem 2.5rem 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;
  
  &:focus {
    outline: none;
    border-color: #007DBC;
    box-shadow: 0 0 0 2px rgba(0, 125, 188, 0.2);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  gap: 0.5rem;
`;

const PaginationButton = styled.button`
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

const PageInfo = styled.span`
  margin: 0 1rem;
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

const ModalFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const MapPreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1rem;
  position: relative;
  border: 1px solid #dee2e6;
`;

const DirectionsButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #4285F4;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #3367D6;
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.success ? '#28a745' : '#dc3545'};
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  z-index: 9999;
  font-size: 1rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  background-color: #f8f9fa;
  
  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #343a40;
  }
  
  p {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: #6c757d;
  }
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const [currentUser, setCurrentUser] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    
    console.log('Current user:', user);
  }, [navigate]);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const response = await donationService.getAllDonations();
        if (response.success) {
          let allDonations = response.data;
          let filteredDonations = allDonations;
          const user = JSON.parse(localStorage.getItem('currentUser'));
          if (user) {
            if (user.role === 'manager' && user.associatedNgo) {
              filteredDonations = allDonations.filter(donation => {
                if (donation.donationType === 'drop-off') {
                  return donation.dropLocationId === user.associatedNgo.id;
                }
                if (donation.donationType === 'pickup') {
                  return (
                    (donation.city && user.associatedNgo.city && donation.city.toLowerCase() === user.associatedNgo.city.toLowerCase()) ||
                    (donation.state && user.associatedNgo.state && donation.state.toLowerCase() === user.associatedNgo.state.toLowerCase()) ||
                    (donation.pinCode && user.associatedNgo.pinCode && donation.pinCode === user.associatedNgo.pinCode)
                  );
                }
                return false;
              });
            } else if (user.role === 'volunteer') {
              filteredDonations = allDonations.filter(donation => {
                if (donation.status !== 'confirmed' || donation.donationType !== 'pickup' || donation.pickupAgent) {
                  return false;
                }
                if (user.serviceAreas && user.serviceAreas.length > 0) {
                  return user.serviceAreas.some(area => {
                    return (
                      (donation.city && area.city && donation.city.toLowerCase() === area.city.toLowerCase()) ||
                      (donation.state && area.state && donation.state.toLowerCase() === area.state.toLowerCase()) ||
                      (donation.pinCode && area.pinCode && donation.pinCode === area.pinCode)
                    );
                  });
                }
                if (user.selectedNgos && user.selectedNgos.length > 0) {
                  return user.selectedNgos.some(ngo => {
                    return (
                      (donation.city && ngo.city && donation.city.toLowerCase() === ngo.city.toLowerCase()) ||
                      (donation.state && ngo.state && donation.state.toLowerCase() === ngo.state.toLowerCase()) ||
                      (donation.pinCode && ngo.pinCode && donation.pinCode === ngo.pinCode)
                    );
                  });
                }
                return true;
              });
            }
          }
          setDonations(filteredDonations);
          const stats = {
            total: filteredDonations.length,
            pending: filteredDonations.filter(d => d.status === 'pending').length,
            confirmed: filteredDonations.filter(d => d.status === 'confirmed').length,
            completed: filteredDonations.filter(d => d.status === 'completed').length,
            cancelled: filteredDonations.filter(d => d.status === 'cancelled').length
          };
          setStats(stats);
        }
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonations();
  }, []);

  useEffect(() => {
    let filtered = [...donations];
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(donation => donation.status === activeTab);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(donation => 
        donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation._id.includes(searchTerm) ||
        donation.phone.includes(searchTerm) ||
        donation.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(donation => donation.status === statusFilter);
    }
    
    filtered = filtered.map((donation, index) => ({
      ...donation,
      displayId: index + 1
    }));
    
    setFilteredDonations(filtered);
    setCurrentPage(1); 
  }, [activeTab, donations, searchTerm, statusFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDonations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/admin/login');
  };
  
  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };
  
  const handleStatusChange = async (donationId, newStatus) => {
    setActionLoading(true);
    try {
      const response = await donationService.updateDonationStatus(donationId, newStatus);
      
      if (response.success) {
        const updatedDonations = donations.map(donation => 
          donation._id === donationId ? { ...donation, status: newStatus } : donation
        );
        
        setDonations(updatedDonations);
        
        const updatedStats = {
          total: updatedDonations.length,
          pending: updatedDonations.filter(d => d.status === 'pending').length,
          confirmed: updatedDonations.filter(d => d.status === 'confirmed').length,
          completed: updatedDonations.filter(d => d.status === 'completed').length,
          cancelled: updatedDonations.filter(d => d.status === 'cancelled').length
        };
        setStats(updatedStats);
        
        setShowModal(false);
      } else {
        alert(response.message || 'Error updating donation status');
      }
    } catch (error) {
      console.error('Error updating donation status:', error);
      alert('Error updating donation status');
    } finally {
      setActionLoading(false);
    }
  };

  const navigateToDropLocations = () => {
    navigate('/admin/drop-locations');
  };
  
  const navigateToUserManagement = () => {
    navigate('/admin/users');
  };

  const navigateToVolunteerManagement = () => {
    navigate('/admin/volunteers');
  };

  const navigateToNgoApplication = () => {
    navigate('/admin/ngo-application');
  };

  // Initialize map for donation location
  const initMap = () => {
    if (!window.google || !window.google.maps || !document.getElementById('donation-location-map')) {
      return;
    }
    
    const mapOptions = {
      center: { lat: 20.5937, lng: 78.9629 }, // Center of India
      zoom: 5,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    };
    
    const map = new window.google.maps.Map(document.getElementById('donation-location-map'), mapOptions);
    mapRef.current = map;
    
    // Add marker if donation has location
    if (selectedDonation && selectedDonation.location && selectedDonation.location.coordinates) {
      const { lat, lng } = selectedDonation.location.coordinates;
      const position = { lat, lng };
      
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: 'Donation Location'
      });
      
      markerRef.current = marker;
      map.setCenter(position);
      map.setZoom(15);
    }
  };
  
  // Initialize map when donation is selected
  useEffect(() => {
    if (selectedDonation) {
      initMap();
    }
  }, [selectedDonation]);

  const getDirectionsUrl = (donation) => {
    if (!donation || !donation.coordinates) return '#';
    
    const coordinates = donation.coordinates;
    const lat = coordinates.lat || 0;
    const lng = coordinates.lng || 0;
    const address = encodeURIComponent(donation.address);
    
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${address}`;
  };
  
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
        <DashboardHeader>
          <Title>
            {currentUser && currentUser.role === 'manager' 
              ? `${currentUser.associatedNgo?.name || 'NGO'} Dashboard` 
              : currentUser && currentUser.role === 'admin'
                ? 'Admin Dashboard'
                : 'Dashboard'}
          </Title>
          <ButtonGroup>
            {currentUser && currentUser.role === 'admin' && (
              <>
                <ActionLink onClick={navigateToDropLocations}>
                  <FaMapMarkedAlt style={{ marginRight: '0.5rem' }} />
                  Manage Drop Locations
                </ActionLink>
                <ActionLink onClick={navigateToUserManagement}>
                  <FaUsers style={{ marginRight: '0.5rem' }} />
                  Manage Users
                </ActionLink>
              </>
            )}
            {currentUser && currentUser.role === 'manager' && (
              <ActionLink onClick={navigateToVolunteerManagement}>
                <FaUsers style={{ marginRight: '0.5rem' }} />
                Show Volunteers
              </ActionLink>
            )}
            {currentUser && currentUser.role === 'volunteer' && (
              <ActionLink onClick={navigateToNgoApplication}>
                <FaUsers style={{ marginRight: '0.5rem' }} />
                Apply for NGOs
              </ActionLink>
            )}
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
              Logout
            </LogoutButton>
          </ButtonGroup>
        </DashboardHeader>
        
        <DashboardStats>
          <StatCard color="#007DBC">
            <FaBoxOpen />
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Donations</StatLabel>
          </StatCard>
          <StatCard color="#FFC107">
            <FaSpinner />
            <StatValue>{stats.pending}</StatValue>
            <StatLabel>Pending</StatLabel>
          </StatCard>
          <StatCard color="#28A745">
            <FaCheckCircle />
            <StatValue>{stats.confirmed}</StatValue>
            <StatLabel>Confirmed</StatLabel>
          </StatCard>
          <StatCard color="#17A2B8">
            <FaCheckCircle />
            <StatValue>{stats.completed}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatCard>
          <StatCard color="#DC3545">
            <FaTimesCircle />
            <StatValue>{stats.cancelled}</StatValue>
            <StatLabel>Cancelled</StatLabel>
          </StatCard>
        </DashboardStats>
        
        <Card>
          <TabsContainer>
            <Tab 
              active={activeTab === 'all'} 
              onClick={() => setActiveTab('all')}
            >
              All Donations
            </Tab>
            <Tab 
              active={activeTab === 'pending'} 
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </Tab>
            <Tab 
              active={activeTab === 'confirmed'} 
              onClick={() => setActiveTab('confirmed')}
            >
              Confirmed
            </Tab>
            <Tab 
              active={activeTab === 'completed'} 
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </Tab>
            <Tab 
              active={activeTab === 'cancelled'} 
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled
            </Tab>
          </TabsContainer>
          
          <SearchContainer>
            <FaSearch />
            <SearchInput 
              type="text" 
              placeholder="Search by name, email, phone or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FilterSelect 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </FilterSelect>
          </SearchContainer>
          
          {loading ? (
            <LoadingOverlay>
              <FaSpinner />
            </LoadingOverlay>
          ) : (
            <>
              {currentItems.length > 0 ? (
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Type</Th>
                        <Th>Items</Th>
                        <Th>Status</Th>
                        <Th>Date</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((donation) => (
                        <tr key={donation._id}>
                          <Td>#{donation.displayId}</Td>
                          <Td>{donation.name}</Td>
                          <Td>{donation.donationType === 'pickup' ? 'Pickup' : 'Drop-off'}</Td>
                          <Td>{donation.items && Array.isArray(donation.items) ? donation.items.join(', ') : 'N/A'}</Td>
                          <Td>
                            <StatusBadge status={donation.status}>
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </StatusBadge>
                          </Td>
                          <Td>{new Date(donation.createdAt).toLocaleDateString()}</Td>
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
                                  onClick={() => handleStatusChange(donation._id, 'confirmed')}
                                  disabled={actionLoading}
                                >
                                  Approve
                                </ActionButton>
                                <ActionButton 
                                  action="reject"
                                  onClick={() => handleStatusChange(donation._id, 'cancelled')}
                                  disabled={actionLoading}
                                >
                                  Reject
                                </ActionButton>
                              </>
                            )}
                            
                            {donation.status === 'confirmed' && (
                              <ActionButton 
                                action="complete"
                                onClick={() => handleStatusChange(donation._id, 'completed')}
                                disabled={actionLoading}
                              >
                                Complete
                              </ActionButton>
                            )}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  
                  <Pagination>
                    <PaginationButton 
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </PaginationButton>
                    
                    <PageInfo>
                      Page {currentPage} of {totalPages}
                    </PageInfo>
                    
                    <PaginationButton 
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </PaginationButton>
                  </Pagination>
                </TableContainer>
              ) : (
                <EmptyState>
                  No donations found matching the current filters.
                </EmptyState>
              )}
            </>
          )}
        </Card>
        
        {/* Donation Details Modal */}
        {showModal && selectedDonation && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Donation Details</ModalTitle>
                <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
              </ModalHeader>
              <ModalBody>
                <DetailItem>
                  <DetailLabel>Donation ID</DetailLabel>
                  <DetailValue>#{selectedDonation.displayId}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Name</DetailLabel>
                  <DetailValue>{selectedDonation.name}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Contact</DetailLabel>
                  <DetailValue>
                    {selectedDonation.phone}<br />
                    {selectedDonation.email}
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Date Submitted</DetailLabel>
                  <DetailValue>{formatDate(selectedDonation.createdAt)}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Donation Method</DetailLabel>
                  <DetailValue>{selectedDonation.donationType === 'pickup' ? 'Pickup' : 'Drop-off'}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Pin Code</DetailLabel>
                  <DetailValue>{selectedDonation.pinCode}</DetailValue>
                </DetailItem>
                
                {selectedDonation.donationType === 'pickup' ? (
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
                    
                    <DetailItem>
                      <DetailLabel>Location</DetailLabel>
                      <DetailValue>
                        <MapPreview id="donation-location-map"></MapPreview>
                        <DirectionsButton 
                          href={getDirectionsUrl(selectedDonation)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <FaDirections /> Get Directions
                        </DirectionsButton>
                      </DetailValue>
                    </DetailItem>
                  </>
                ) : (
                  <DetailItem>
                    <DetailLabel>Drop Location ID</DetailLabel>
                    <DetailValue>{selectedDonation.dropLocationId}</DetailValue>
                  </DetailItem>
                )}
                
                <DetailItem>
                  <DetailLabel>Food Items</DetailLabel>
                  <DetailValue>
                    <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                      {selectedDonation.foodItems.map((item, index) => (
                        <li key={index}>{item.name} - {item.quantity} {item.unit}</li>
                      ))}
                    </ul>
                  </DetailValue>
                </DetailItem>
                
                {selectedDonation.notes && (
                  <DetailItem>
                    <DetailLabel>Additional Notes</DetailLabel>
                    <DetailValue>{selectedDonation.notes}</DetailValue>
                  </DetailItem>
                )}
              </ModalBody>
              <ModalFooter>
                {/* Manager: Accept pickup */}
                {selectedDonation.status === 'pending' && currentUser && currentUser.role === 'manager' && selectedDonation.donationType === 'pickup' && (
                  <ActionButton 
                    action="approve"
                    onClick={() => handleStatusChange(selectedDonation._id, 'confirmed')}
                    disabled={actionLoading}
                  >
                    Accept Pickup
                  </ActionButton>
                )}
                {/* Manager: Confirm drop-off */}
                {selectedDonation.status === 'pending' && currentUser && currentUser.role === 'manager' && selectedDonation.donationType === 'drop-off' && (
                  <ActionButton 
                    action="approve"
                    onClick={() => handleStatusChange(selectedDonation._id, 'confirmed')}
                    disabled={actionLoading}
                  >
                    Confirm Drop-off
                  </ActionButton>
                )}
                {/* Admin: Confirm/cancel */}
                {selectedDonation.status === 'pending' && currentUser && currentUser.role === 'admin' && (
                  <>
                    <ActionButton 
                      action="approve"
                      onClick={() => handleStatusChange(selectedDonation._id, 'confirmed')}
                      disabled={actionLoading}
                    >
                      Confirm
                    </ActionButton>
                    <ActionButton 
                      action="reject"
                      onClick={() => handleStatusChange(selectedDonation._id, 'cancelled')}
                      disabled={actionLoading}
                    >
                      Cancel
                    </ActionButton>
                  </>
                )}
                
                {/* Complete donation (admin/manager) */}
                {selectedDonation.status === 'confirmed' && (
                  <ActionButton 
                    action="complete"
                    onClick={() => handleStatusChange(selectedDonation._id, 'completed')}
                    disabled={actionLoading}
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
      </Container>
    </PageWrapper>
  );
};

export default AdminDashboard;
