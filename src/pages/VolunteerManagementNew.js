import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaSpinner, FaSearch, FaUserCheck, FaUserTimes, FaArrowLeft } from 'react-icons/fa';
import { authService } from '../services/api';

// API URL from environment or default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VolunteerManagementNew = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [currentDropLocation, setCurrentDropLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('volunteers');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'manager') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // First fetch drop locations
        await fetchDropLocations();
      } catch (error) {
        console.error('Error in initial data fetch:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fetch all drop locations
  const fetchDropLocations = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const user = authService.getCurrentUser();
      
      console.log('Current user:', user);
      
      // Use the single correct endpoint for drop locations
      const response = await fetch(`${API_URL}/api/drop-locations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Drop locations fetched:', data);
      
      let dropLocations = [];
      if (data && data.success && Array.isArray(data.data)) {
        dropLocations = data.data;
      } else if (data && Array.isArray(data)) {
        dropLocations = data;
      } else {
        throw new Error('Invalid data format received from server');
      }
      
      if (dropLocations.length === 0) {
        setFeedback('No drop locations found in the system.');
        setFeedbackSuccess(false);
        setLoading(false);
        return;
      }
      
      console.log('Processed drop locations:', dropLocations);
      
      // If user has a dropLocationId, use that
      if (user && user.dropLocationId) {
        const userDropLocation = dropLocations.find(loc => loc._id === user.dropLocationId);
        if (userDropLocation) {
          setCurrentDropLocation(userDropLocation);
          await fetchVolunteersAndApplications(userDropLocation._id);
          return;
        }
      }
      
      // If user has an associatedNgo, use that
      if (user && user.associatedNgo) {
        const userNgo = dropLocations.find(loc => loc._id === user.associatedNgo);
        if (userNgo) {
          setCurrentDropLocation(userNgo);
          await fetchVolunteersAndApplications(userNgo._id);
          return;
        }
      }
      
      // Otherwise use the first drop location
      setCurrentDropLocation(dropLocations[0]);
      await fetchVolunteersAndApplications(dropLocations[0]._id);
    } catch (error) {
      console.error('Error fetching drop locations:', error);
      setFeedback('Error fetching drop locations: ' + (error.message || 'Unknown error'));
      setFeedbackSuccess(false);
      setLoading(false);
    }
  };
  
  // Fetch both volunteers and applications for a drop location
  const fetchVolunteersAndApplications = async (dropLocationId) => {
    try {
      await Promise.all([
        fetchVolunteers(dropLocationId),
        fetchPendingApplications(dropLocationId)
      ]);
    } catch (error) {
      console.error('Error fetching volunteers and applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch volunteers for a drop location
  const fetchVolunteers = async (dropLocationId) => {
    try {
      if (!dropLocationId) {
        console.error('No drop location ID provided');
        return;
      }
      
      const token = authService.getToken();
      
      // Use the new volunteer endpoint
      const response = await fetch(`${API_URL}/api/volunteers/drop-location/${dropLocationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        setVolunteers([]);
        return;
      }
      
      const data = await response.json();
      console.log('Volunteers fetched:', data);
      
      if (data && data.success && Array.isArray(data.data)) {
        setVolunteers(data.data);
      } else if (data && Array.isArray(data)) {
        setVolunteers(data);
      } else {
        console.error('Invalid volunteers data format:', data);
        setVolunteers([]);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      setVolunteers([]);
    }
  };
  
  // Fetch pending applications for a drop location
  const fetchPendingApplications = async (dropLocationId) => {
    try {
      if (!dropLocationId) {
        console.error('No drop location ID provided');
        return;
      }
      
      const token = authService.getToken();
      
      // Use the new applications endpoint
      const response = await fetch(`${API_URL}/api/volunteers/applications/drop-location/${dropLocationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        setPendingApplications([]);
        return;
      }
      
      const data = await response.json();
      console.log('Pending applications fetched:', data);
      
      if (data && data.success && Array.isArray(data.data)) {
        setPendingApplications(data.data);
      } else if (data && Array.isArray(data)) {
        setPendingApplications(data);
      } else {
        console.error('Invalid pending applications data format:', data);
        setPendingApplications([]);
      }
    } catch (error) {
      console.error('Error fetching pending applications:', error);
      setPendingApplications([]);
    }
  };
  
  // Process a volunteer application (approve/reject)
  const handleApplicationAction = async (applicationId, action) => {
    try {
      setActionLoading(true);
      
      console.log(`Processing application ${applicationId} with action: ${action}`);
      
      const token = authService.getToken();
      
      // Use the new application processing endpoint
      const response = await fetch(`${API_URL}/api/volunteers/applications/${applicationId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Application processed:', data);
      
      if (data && data.success) {
        // Update the pending applications list by removing the processed application
        setPendingApplications(pendingApplications.filter(app => app._id !== applicationId));
        
        setFeedback(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        setFeedbackSuccess(true);
        
        // If approved, refresh the volunteers list
        if (action === 'approve' && currentDropLocation) {
          fetchVolunteers(currentDropLocation._id);
        }
      } else {
        console.error('Error processing application:', data);
        setFeedback(`Failed to ${action} application: ${data?.message || 'Unknown error'}`);
        setFeedbackSuccess(false);
      }
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      setFeedback(`Failed to ${action} application: ${error.message || 'Unknown error'}`);
      setFeedbackSuccess(false);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Toggle volunteer active status
  const toggleVolunteerStatus = async (volunteerId, currentStatus) => {
    try {
      setActionLoading(true);
      
      const newStatus = !currentStatus;
      console.log(`Changing volunteer ${volunteerId} status to ${newStatus ? 'active' : 'inactive'}`);
      
      const token = authService.getToken();
      
      // Use the new volunteer status endpoint
      const response = await fetch(`${API_URL}/api/volunteers/${volunteerId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: newStatus })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Volunteer status updated:', data);
      
      if (data && data.success) {
        // Update the volunteer in the list
        setVolunteers(volunteers.map(vol => 
          vol._id === volunteerId ? { ...vol, isActive: newStatus } : vol
        ));
        
        setFeedback(`Volunteer ${newStatus ? 'activated' : 'deactivated'} successfully`);
        setFeedbackSuccess(true);
      } else {
        console.error('Error updating volunteer status:', data);
        setFeedback(`Failed to update volunteer status: ${data?.message || 'Unknown error'}`);
        setFeedbackSuccess(false);
      }
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      setFeedback(`Failed to update volunteer status: ${error.message || 'Unknown error'}`);
      setFeedbackSuccess(false);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Filter volunteers based on search term
  const filteredVolunteers = volunteers.filter(volunteer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      volunteer.name?.toLowerCase().includes(searchLower) ||
      volunteer.email?.toLowerCase().includes(searchLower) ||
      volunteer.phone?.toLowerCase().includes(searchLower) ||
      volunteer.city?.toLowerCase().includes(searchLower) ||
      volunteer.state?.toLowerCase().includes(searchLower)
    );
  });
  
  // Filter applications based on search term
  const filteredApplications = pendingApplications.filter(app => {
    const searchLower = searchTerm.toLowerCase();
    return (
      app.volunteerName?.toLowerCase().includes(searchLower) ||
      app.email?.toLowerCase().includes(searchLower) ||
      app.phone?.toLowerCase().includes(searchLower) ||
      app.city?.toLowerCase().includes(searchLower) ||
      app.state?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Container>
      <Header>
        <HeaderTop>
          <BackButton onClick={() => navigate('/admin')}>
            <FaArrowLeft /> Back to Dashboard
          </BackButton>
          <h1>Volunteer Management</h1>
        </HeaderTop>
        {currentDropLocation && (
          <NGOInfo>
            <h3>Managing NGO: {currentDropLocation.name}</h3>
            <p>{currentDropLocation.address}, {currentDropLocation.city}, {currentDropLocation.state} - {currentDropLocation.pincode}</p>
          </NGOInfo>
        )}
      </Header>
      
      {feedback && (
        <FeedbackMessage isSuccess={feedbackSuccess}>
          {feedback}
        </FeedbackMessage>
      )}
      
      <TabContainer>
        <TabButton 
          onClick={() => setActiveTab('volunteers')} 
          isActive={activeTab === 'volunteers'}
        >
          Current Volunteers ({volunteers.length})
        </TabButton>
        <TabButton 
          onClick={() => setActiveTab('applications')} 
          isActive={activeTab === 'applications'}
        >
          Pending Applications ({pendingApplications.length})
        </TabButton>
      </TabContainer>
      
      <SearchContainer>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Search by name, email, phone, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading data...</p>
        </LoadingContainer>
      ) : (
        <>
          {activeTab === 'volunteers' && (
            <Section>
              <h2>Current Volunteers</h2>
              {filteredVolunteers.length === 0 ? (
                <EmptyState>No volunteers found.</EmptyState>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Location</th>
                      <th>Joined Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVolunteers.map(volunteer => (
                      <tr key={volunteer._id}>
                        <td>{volunteer.name}</td>
                        <td>
                          <div>{volunteer.email}</div>
                          <div>{volunteer.phone}</div>
                        </td>
                        <td>{volunteer.city}, {volunteer.state}</td>
                        <td>{new Date(volunteer.joinedDate).toLocaleDateString()}</td>
                        <td>
                          <StatusBadge isActive={volunteer.isActive}>
                            {volunteer.isActive ? 'Active' : 'Inactive'}
                          </StatusBadge>
                        </td>
                        <td>
                          <ActionButton
                            onClick={() => toggleVolunteerStatus(volunteer._id, volunteer.isActive)}
                            disabled={actionLoading}
                            color={volunteer.isActive ? '#e74c3c' : '#2ecc71'}
                          >
                            {actionLoading ? (
                              <FaSpinner className="spinner" />
                            ) : volunteer.isActive ? (
                              <><FaUserTimes /> Deactivate</>
                            ) : (
                              <><FaUserCheck /> Activate</>
                            )}
                          </ActionButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          )}
          
          {activeTab === 'applications' && (
            <Section>
              <h2>Pending Applications</h2>
              {filteredApplications.length === 0 ? (
                <EmptyState>No pending applications found.</EmptyState>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Location</th>
                      <th>Applied Date</th>
                      <th>Message</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map(application => (
                      <tr key={application._id}>
                        <td>{application.volunteerName}</td>
                        <td>
                          <div>{application.email}</div>
                          <div>{application.phone}</div>
                        </td>
                        <td>{application.city}, {application.state}</td>
                        <td>{new Date(application.appliedDate).toLocaleDateString()}</td>
                        <td className="message-cell">{application.message || 'No message provided'}</td>
                        <td>
                          <ActionButtonsContainer>
                            <ActionButton
                              onClick={() => handleApplicationAction(application._id, 'approve')}
                              disabled={actionLoading}
                              color="#2ecc71"
                            >
                              {actionLoading ? <FaSpinner className="spinner" /> : <><FaCheck /> Approve</>}
                            </ActionButton>
                            <ActionButton
                              onClick={() => handleApplicationAction(application._id, 'reject')}
                              disabled={actionLoading}
                              color="#e74c3c"
                            >
                              {actionLoading ? <FaSpinner className="spinner" /> : <><FaTimes /> Reject</>}
                            </ActionButton>
                          </ActionButtonsContainer>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          )}
        </>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.div`
  margin-bottom: 20px;
  
  h1 {
    color: #2c3e50;
    margin-bottom: 10px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  h1 {
    margin: 0;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  margin-right: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const NGOInfo = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  
  h3 {
    margin: 0 0 10px 0;
    color: #2c3e50;
  }
  
  p {
    margin: 0;
    color: #7f8c8d;
  }
`;

const FeedbackMessage = styled.div`
  padding: 12px 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: ${props => props.isSuccess ? '#d4edda' : '#f8d7da'};
  color: ${props => props.isSuccess ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.isSuccess ? '#c3e6cb' : '#f5c6cb'};
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
  color: ${props => props.isActive ? '#3498db' : '#7f8c8d'};
  border-bottom: ${props => props.isActive ? '3px solid #3498db' : 'none'};
  
  &:hover {
    color: #3498db;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 20px 12px 45px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Section = styled.section`
  margin-bottom: 30px;
  
  h2 {
    color: #2c3e50;
    margin-bottom: 15px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  th {
    background-color: #f8f9fa;
    color: #2c3e50;
    font-weight: bold;
  }
  
  tr:hover {
    background-color: #f8f9fa;
  }
  
  .message-cell {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  background-color: ${props => props.isActive ? '#d4edda' : '#f8d7da'};
  color: ${props => props.isActive ? '#155724' : '#721c24'};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  background-color: ${props => props.color || '#3498db'};
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => {
      const color = props.color || '#3498db';
      return color === '#3498db' ? '#2980b9' : 
             color === '#2ecc71' ? '#27ae60' : 
             color === '#e74c3c' ? '#c0392b' : 
             '#2980b9';
    }};
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 5px;
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  
  p {
    margin-top: 15px;
    color: #7f8c8d;
  }
`;

const LoadingSpinner = styled(FaSpinner)`
  font-size: 30px;
  color: #3498db;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  padding: 30px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 5px;
  color: #7f8c8d;
`;

export default VolunteerManagementNew;
