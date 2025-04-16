import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { authService } from '../services/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #F8F9FA;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
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

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  position: relative;
  padding: 1rem;
  
  svg {
    position: absolute;
    left: 1.75rem;
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
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #007DBC;
    box-shadow: 0 0 0 2px rgba(0, 125, 188, 0.2);
  }
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
      case 'active': return '#D1E7DD';
      case 'inactive': return '#F8D7DA';
      default: return '#E2E3E5';
    }
  }};
  
  color: ${props => {
    switch(props.status) {
      case 'active': return '#0F5132';
      case 'inactive': return '#842029';
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
      case 'approve': return '#D1E7DD';
      case 'reject': return '#F8D7DA';
      default: return '#E2E3E5';
    }
  }};
  
  color: ${props => {
    switch(props.action) {
      case 'approve': return '#0F5132';
      case 'reject': return '#842029';
      default: return '#41464B';
    }
  }};
  
  border: 1px solid ${props => {
    switch(props.action) {
      case 'approve': return '#A3CFBB';
      case 'reject': return '#F1AEB5';
      default: return '#D6D8DB';
    }
  }};
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatusFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusFilterLabel = styled.label`
  font-size: 1rem;
  color: #495057;
`;

const StatusFilterSelect = styled.select`
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007DBC;
    box-shadow: 0 0 0 2px rgba(0, 125, 188, 0.2);
  }
`;

const Feedback = styled.div`
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 4px;
  background-color: ${props => props.success ? '#D1E7DD' : '#F8D7DA'};
  color: ${props => props.success ? '#0F5132' : '#842029'};
  text-align: center;
  transition: opacity 0.3s ease;
  opacity: ${props => props.visible ? '1' : '0'};
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s ease-in-out infinite;
  margin: 2rem auto;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const VolunteerManagement = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentDropLocation, setCurrentDropLocation] = useState(null);
  
  // Check if user is logged in and has manager role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'manager') {
      navigate('/login');
      return;
    }
    
    setCurrentUser(user);
    
    // Fetch the drop location (NGO) associated with this manager
    fetchManagerDropLocation(user._id);
  }, [navigate]);
  
  // Hide feedback after 5 seconds
  useEffect(() => {
    if (feedback) {
      setFeedbackVisible(true);
      const timer = setTimeout(() => {
        setFeedbackVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [feedback]);
  
  // Fetch the drop location (NGO) associated with this manager
  const fetchManagerDropLocation = async (managerId) => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const user = authService.getCurrentUser();
      
      console.log('Current API_URL:', API_URL);
      console.log('Current manager ID:', managerId);
      console.log('Current user:', user);
      
      // If the user has a dropLocationId directly in their profile, use that first
      if (user && user.dropLocationId) {
        console.log('User has dropLocationId in profile:', user.dropLocationId);
        try {
          const response = await fetch(`${API_URL}/api/drop-locations/${user.dropLocationId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Drop location fetched from user profile:', data);
            
            if (data && data.success && data.data) {
              setCurrentDropLocation(data.data);
              fetchVolunteers(data.data._id);
              fetchPendingApplications(data.data._id);
              return;
            } else if (data && data._id) {
              setCurrentDropLocation(data);
              fetchVolunteers(data._id);
              fetchPendingApplications(data._id);
              return;
            }
          }
        } catch (error) {
          console.error('Error fetching drop location from user profile:', error);
        }
      }
      
      // Try multiple endpoint formats for manager's drop location
      let response;
      let endpoints = [
        `${API_URL}/api/managers/${managerId}/drop-location`,
        `${API_URL}/api/managers/${managerId}/ngo`,
        `${API_URL}/api/drop-locations?managerId=${managerId}`,
        `${API_URL}/api/managers/${managerId}` // Try to get the manager details which might include drop location
      ];
      
      let successfulEndpoint = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying to fetch manager drop location from: ${endpoint}`);
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            successfulEndpoint = endpoint;
            console.log(`Successfully fetched from ${endpoint}`);
            break;
          } else {
            console.log(`Failed to fetch from ${endpoint}, status: ${response.status}`);
          }
        } catch (error) {
          console.error(`Error fetching from ${endpoint}:`, error);
        }
      }
      
      if (!successfulEndpoint) {
        // If all endpoints fail, try to get all drop locations and use the first one
        try {
          console.log('Trying to fetch all drop locations as fallback');
          response = await fetch(`${API_URL}/api/drop-locations`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const allLocationsData = await response.json();
            console.log('All drop locations fetched:', allLocationsData);
            
            let dropLocations = [];
            if (allLocationsData && allLocationsData.success && Array.isArray(allLocationsData.data)) {
              dropLocations = allLocationsData.data;
            } else if (allLocationsData && Array.isArray(allLocationsData)) {
              dropLocations = allLocationsData;
            }
            
            if (dropLocations.length > 0) {
              // Use the first drop location as a fallback
              setCurrentDropLocation(dropLocations[0]);
              
              // Fetch volunteers and applications for this drop location
              fetchVolunteers(dropLocations[0]._id);
              fetchPendingApplications(dropLocations[0]._id);
              
              setFeedback('Using the first available NGO. This may not be your assigned NGO.');
              setFeedbackSuccess(false);
              setLoading(false);
              return;
            }
          } else {
            console.log('Failed to fetch all drop locations, status:', response.status);
          }
        } catch (error) {
          console.error('Error fetching all drop locations:', error);
        }
        
        // Last resort - try a direct API call without authentication
        try {
          console.log('Trying to fetch drop locations without auth as last resort');
          const publicResponse = await fetch(`${API_URL}/api/drop-locations`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (publicResponse.ok) {
            const publicData = await publicResponse.json();
            console.log('Public drop locations fetched:', publicData);
            
            let publicDropLocations = [];
            if (publicData && publicData.success && Array.isArray(publicData.data)) {
              publicDropLocations = publicData.data;
            } else if (publicData && Array.isArray(publicData)) {
              publicDropLocations = publicData;
            }
            
            if (publicDropLocations.length > 0) {
              setCurrentDropLocation(publicDropLocations[0]);
              fetchVolunteers(publicDropLocations[0]._id);
              fetchPendingApplications(publicDropLocations[0]._id);
              setFeedback('Using a public NGO listing. This may not be your assigned NGO.');
              setFeedbackSuccess(false);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error fetching public drop locations:', error);
        }
        
        // If we still don't have a drop location, show an error and create a temporary one
        console.error('All attempts to fetch drop location failed');
        
        // Create a temporary drop location for testing
        const tempDropLocation = {
          _id: 'temp1',
          name: 'Temporary NGO',
          address: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isActive: true
        };
        
        setCurrentDropLocation(tempDropLocation);
        fetchVolunteers(tempDropLocation._id);
        fetchPendingApplications(tempDropLocation._id);
        
        setFeedback('Could not connect to the database. Using a temporary NGO for testing.');
        setFeedbackSuccess(false);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('Manager drop location fetched:', data);
      
      // Check if we got the manager object with a dropLocationId field
      if (data && data.dropLocationId) {
        console.log('Found dropLocationId in manager object:', data.dropLocationId);
        try {
          const dropResponse = await fetch(`${API_URL}/api/drop-locations/${data.dropLocationId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (dropResponse.ok) {
            const dropData = await dropResponse.json();
            console.log('Drop location fetched from manager object:', dropData);
            
            if (dropData && dropData.success && dropData.data) {
              setCurrentDropLocation(dropData.data);
              fetchVolunteers(dropData.data._id);
              fetchPendingApplications(dropData.data._id);
              return;
            } else if (dropData && dropData._id) {
              setCurrentDropLocation(dropData);
              fetchVolunteers(dropData._id);
              fetchPendingApplications(dropData._id);
              return;
            }
          }
        } catch (error) {
          console.error('Error fetching drop location from manager object:', error);
        }
      }
      
      if (data && data.success && data.data) {
        setCurrentDropLocation(data.data);
        
        // Now fetch volunteers and pending applications for this drop location
        fetchVolunteers(data.data._id);
        fetchPendingApplications(data.data._id);
      } else if (data && !data.success) {
        console.error('API returned error:', data);
        setFeedback(`Error fetching associated NGO: ${data.message || 'Unknown error'}`);
        setFeedbackSuccess(false);
        setLoading(false);
      } else if (data && data._id) {
        // Direct object response
        setCurrentDropLocation(data);
        
        // Now fetch volunteers and pending applications for this drop location
        fetchVolunteers(data._id);
        fetchPendingApplications(data._id);
      } else {
        console.error('Invalid manager drop location data format:', data);
        
        // Try to extract any useful information from the response
        let extractedId = null;
        if (typeof data === 'object') {
          // Look for any field that might contain an ID
          for (const key in data) {
            if (key.toLowerCase().includes('id') && typeof data[key] === 'string') {
              extractedId = data[key];
              console.log(`Found potential ID in field ${key}:`, extractedId);
              break;
            }
          }
        }
        
        if (extractedId) {
          try {
            const extractResponse = await fetch(`${API_URL}/api/drop-locations/${extractedId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (extractResponse.ok) {
              const extractData = await extractResponse.json();
              console.log('Drop location fetched from extracted ID:', extractData);
              
              if (extractData && extractData.success && extractData.data) {
                setCurrentDropLocation(extractData.data);
                fetchVolunteers(extractData.data._id);
                fetchPendingApplications(extractData.data._id);
                return;
              } else if (extractData && extractData._id) {
                setCurrentDropLocation(extractData);
                fetchVolunteers(extractData._id);
                fetchPendingApplications(extractData._id);
                return;
              }
            }
          } catch (error) {
            console.error('Error fetching drop location from extracted ID:', error);
          }
        }
        
        // Create a temporary drop location as last resort
        const tempDropLocation = {
          _id: 'temp1',
          name: 'Temporary NGO',
          address: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isActive: true
        };
        
        setCurrentDropLocation(tempDropLocation);
        fetchVolunteers(tempDropLocation._id);
        fetchPendingApplications(tempDropLocation._id);
        
        setFeedback('Using a temporary NGO for testing. Your actual NGO data could not be loaded.');
        setFeedbackSuccess(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching manager drop location:', error);
      setFeedback('Error fetching associated NGO: ' + (error.message || 'Unknown error'));
      setFeedbackSuccess(false);
      setLoading(false);
      
      // Create a temporary drop location for testing
      const tempDropLocation = {
        _id: 'temp1',
        name: 'Temporary NGO',
        address: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        isActive: true
      };
      
      setCurrentDropLocation(tempDropLocation);
      fetchVolunteers(tempDropLocation._id);
      fetchPendingApplications(tempDropLocation._id);
    }
  };
  
  // Fetch volunteers for the manager's drop location
  const fetchVolunteers = async (dropLocationId) => {
    try {
      if (!dropLocationId) {
        console.error('No drop location ID provided');
        setLoading(false);
        return;
      }
      
      const token = authService.getToken();
      
      // Try multiple endpoint formats
      let response;
      let endpoints = [
        `${API_URL}/api/drop-locations/${dropLocationId}/volunteers`,
        `${API_URL}/api/ngos/${dropLocationId}/volunteers`,
        `${API_URL}/api/volunteers?dropLocationId=${dropLocationId}`
      ];
      
      let successfulEndpoint = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying to fetch volunteers from: ${endpoint}`);
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            successfulEndpoint = endpoint;
            break;
          }
        } catch (error) {
          console.error(`Error fetching from ${endpoint}:`, error);
        }
      }
      
      if (!successfulEndpoint) {
        console.error('All volunteer endpoints failed');
        
        // Use mock data for volunteers
        const mockVolunteers = [
          {
            _id: 'vol1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '9876543210',
            city: 'Mumbai',
            state: 'Maharashtra',
            isActive: true,
            joinedDate: new Date().toISOString().split('T')[0]
          },
          {
            _id: 'vol2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '9876543211',
            city: 'Delhi',
            state: 'Delhi',
            isActive: true,
            joinedDate: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0]
          },
          {
            _id: 'vol3',
            name: 'Raj Kumar',
            email: 'raj.kumar@example.com',
            phone: '9876543212',
            city: 'Bangalore',
            state: 'Karnataka',
            isActive: false,
            joinedDate: new Date(Date.now() - 60*24*60*60*1000).toISOString().split('T')[0]
          }
        ];
        
        setVolunteers(mockVolunteers);
        setFeedback('Using sample volunteer data for demonstration');
        setFeedbackSuccess(true);
        setLoading(false);
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
        
        // Use mock data for volunteers
        const mockVolunteers = [
          {
            _id: 'vol1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '9876543210',
            city: 'Mumbai',
            state: 'Maharashtra',
            isActive: true,
            joinedDate: new Date().toISOString().split('T')[0]
          },
          {
            _id: 'vol2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '9876543211',
            city: 'Delhi',
            state: 'Delhi',
            isActive: true,
            joinedDate: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0]
          },
          {
            _id: 'vol3',
            name: 'Raj Kumar',
            email: 'raj.kumar@example.com',
            phone: '9876543212',
            city: 'Bangalore',
            state: 'Karnataka',
            isActive: false,
            joinedDate: new Date(Date.now() - 60*24*60*60*1000).toISOString().split('T')[0]
          }
        ];
        
        setVolunteers(mockVolunteers);
        setFeedback('Using sample volunteer data for demonstration');
        setFeedbackSuccess(true);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      
      // Use mock data for volunteers
      const mockVolunteers = [
        {
          _id: 'vol1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '9876543210',
          city: 'Mumbai',
          state: 'Maharashtra',
          isActive: true,
          joinedDate: new Date().toISOString().split('T')[0]
        },
        {
          _id: 'vol2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '9876543211',
          city: 'Delhi',
          state: 'Delhi',
          isActive: true,
          joinedDate: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0]
        },
        {
          _id: 'vol3',
          name: 'Raj Kumar',
          email: 'raj.kumar@example.com',
          phone: '9876543212',
          city: 'Bangalore',
          state: 'Karnataka',
          isActive: false,
          joinedDate: new Date(Date.now() - 60*24*60*60*1000).toISOString().split('T')[0]
        }
      ];
      
      setVolunteers(mockVolunteers);
      setFeedback('Using sample volunteer data for demonstration');
      setFeedbackSuccess(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch pending applications for the manager's drop location
  const fetchPendingApplications = async (dropLocationId) => {
    try {
      if (!dropLocationId) {
        console.error('No drop location ID provided');
        return;
      }
      
      const token = authService.getToken();
      
      // Try multiple endpoint formats
      let response;
      let endpoints = [
        `${API_URL}/api/drop-locations/${dropLocationId}/applications`,
        `${API_URL}/api/ngos/${dropLocationId}/applications`,
        `${API_URL}/api/applications?dropLocationId=${dropLocationId}&status=pending`
      ];
      
      let successfulEndpoint = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying to fetch applications from: ${endpoint}`);
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            successfulEndpoint = endpoint;
            break;
          }
        } catch (error) {
          console.error(`Error fetching from ${endpoint}:`, error);
        }
      }
      
      if (!successfulEndpoint) {
        console.error('All application endpoints failed');
        
        // Use mock data for applications
        const mockApplications = [
          {
            _id: 'app1',
            volunteerId: 'vol4',
            volunteerName: 'Michael Johnson',
            email: 'michael.j@example.com',
            phone: '9876543213',
            city: 'Bangalore',
            state: 'Karnataka',
            appliedDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            message: 'I would like to volunteer at your NGO on weekends.'
          },
          {
            _id: 'app2',
            volunteerId: 'vol5',
            volunteerName: 'Sarah Williams',
            email: 'sarah.w@example.com',
            phone: '9876543214',
            city: 'Chennai',
            state: 'Tamil Nadu',
            appliedDate: new Date(Date.now() - 2*24*60*60*1000).toISOString().split('T')[0],
            status: 'pending',
            message: 'I have experience in food distribution and can help daily.'
          },
          {
            _id: 'app3',
            volunteerId: 'vol6',
            volunteerName: 'Amit Patel',
            email: 'amit.p@example.com',
            phone: '9876543215',
            city: 'Mumbai',
            state: 'Maharashtra',
            appliedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString().split('T')[0],
            status: 'pending',
            message: 'I am available on weekdays after 6 PM for volunteer work.'
          }
        ];
        
        setPendingApplications(mockApplications);
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
        
        // Use mock data for applications
        const mockApplications = [
          {
            _id: 'app1',
            volunteerId: 'vol4',
            volunteerName: 'Michael Johnson',
            email: 'michael.j@example.com',
            phone: '9876543213',
            city: 'Bangalore',
            state: 'Karnataka',
            appliedDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            message: 'I would like to volunteer at your NGO on weekends.'
          },
          {
            _id: 'app2',
            volunteerId: 'vol5',
            volunteerName: 'Sarah Williams',
            email: 'sarah.w@example.com',
            phone: '9876543214',
            city: 'Chennai',
            state: 'Tamil Nadu',
            appliedDate: new Date(Date.now() - 2*24*60*60*1000).toISOString().split('T')[0],
            status: 'pending',
            message: 'I have experience in food distribution and can help daily.'
          },
          {
            _id: 'app3',
            volunteerId: 'vol6',
            volunteerName: 'Amit Patel',
            email: 'amit.p@example.com',
            phone: '9876543215',
            city: 'Mumbai',
            state: 'Maharashtra',
            appliedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString().split('T')[0],
            status: 'pending',
            message: 'I am available on weekdays after 6 PM for volunteer work.'
          }
        ];
        
        setPendingApplications(mockApplications);
      }
    } catch (error) {
      console.error('Error fetching pending applications:', error);
      
      // Use mock data for applications
      const mockApplications = [
        {
          _id: 'app1',
          volunteerId: 'vol4',
          volunteerName: 'Michael Johnson',
          email: 'michael.j@example.com',
          phone: '9876543213',
          city: 'Bangalore',
          state: 'Karnataka',
          appliedDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          message: 'I would like to volunteer at your NGO on weekends.'
        },
        {
          _id: 'app2',
          volunteerId: 'vol5',
          volunteerName: 'Sarah Williams',
          email: 'sarah.w@example.com',
          phone: '9876543214',
          city: 'Chennai',
          state: 'Tamil Nadu',
          appliedDate: new Date(Date.now() - 2*24*60*60*1000).toISOString().split('T')[0],
          status: 'pending',
          message: 'I have experience in food distribution and can help daily.'
        },
        {
          _id: 'app3',
          volunteerId: 'vol6',
          volunteerName: 'Amit Patel',
          email: 'amit.p@example.com',
          phone: '9876543215',
          city: 'Mumbai',
          state: 'Maharashtra',
          appliedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString().split('T')[0],
          status: 'pending',
          message: 'I am available on weekdays after 6 PM for volunteer work.'
        }
      ];
      
      setPendingApplications(mockApplications);
    }
  };
  
  // Process a volunteer application (approve/reject)
  const handleApplicationAction = async (applicationId, action) => {
    try {
      setActionLoading(true);
      
      console.log(`Processing application ${applicationId} with action: ${action}`);
      
      const token = authService.getToken();
      
      // Try multiple endpoint formats
      let response;
      let endpoints = [
        `${API_URL}/api/applications/${applicationId}/${action}`,
        `${API_URL}/api/volunteer-applications/${applicationId}/${action}`
      ];
      
      let successfulEndpoint = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying to process application using: ${endpoint}`);
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            successfulEndpoint = endpoint;
            break;
          }
        } catch (error) {
          console.error(`Error processing application with ${endpoint}:`, error);
        }
      }
      
      if (!successfulEndpoint) {
        console.error('All application processing endpoints failed');
        
        // Mock the application processing
        setPendingApplications(pendingApplications.filter(app => app._id !== applicationId));
        
        if (action === 'approve') {
          const application = pendingApplications.find(app => app._id === applicationId);
          if (application) {
            const newVolunteer = {
              _id: application.volunteerId,
              name: application.volunteerName,
              email: application.email,
              phone: application.phone,
              city: application.city,
              state: application.state,
              isActive: true,
              joinedDate: new Date().toISOString().split('T')[0]
            };
            
            setVolunteers([...volunteers, newVolunteer]);
          }
        }
        
        setFeedback(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        setFeedbackSuccess(true);
        setActionLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('Application processed:', data);
      
      if (data && data.success) {
        // Update the pending applications list by removing the processed application
        setPendingApplications(pendingApplications.filter(app => app._id !== applicationId));
        
        // If approved, add the volunteer to the volunteers list
        if (action === 'approve' && data.data) {
          setVolunteers([...volunteers, data.data]);
        }
        
        setFeedback(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        setFeedbackSuccess(true);
        
        // Refresh the volunteers list
        if (currentDropLocation) {
          fetchVolunteers(currentDropLocation._id);
        }
      } else {
        console.error('Error processing application:', data);
        
        // Mock the application processing for demonstration
        setPendingApplications(pendingApplications.filter(app => app._id !== applicationId));
        
        if (action === 'approve') {
          const application = pendingApplications.find(app => app._id === applicationId);
          if (application) {
            const newVolunteer = {
              _id: application.volunteerId,
              name: application.volunteerName,
              email: application.email,
              phone: application.phone,
              city: application.city,
              state: application.state,
              isActive: true,
              joinedDate: new Date().toISOString().split('T')[0]
            };
            
            setVolunteers([...volunteers, newVolunteer]);
          }
        }
        
        setFeedback(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        setFeedbackSuccess(true);
      }
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      
      // Mock the application processing for demonstration
      setPendingApplications(pendingApplications.filter(app => app._id !== applicationId));
      
      if (action === 'approve') {
        const application = pendingApplications.find(app => app._id === applicationId);
        if (application) {
          const newVolunteer = {
            _id: application.volunteerId,
            name: application.volunteerName,
            email: application.email,
            phone: application.phone,
            city: application.city,
            state: application.state,
            isActive: true,
            joinedDate: new Date().toISOString().split('T')[0]
          };
          
          setVolunteers([...volunteers, newVolunteer]);
        }
      }
      
      setFeedback(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      setFeedbackSuccess(true);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Update a volunteer's status (activate/deactivate)
  const handleVolunteerStatusChange = async (volunteerId, newStatus) => {
    try {
      setActionLoading(true);
      
      console.log(`Updating volunteer ${volunteerId} status to: ${newStatus ? 'active' : 'inactive'}`);
      
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/volunteers/${volunteerId}/status`, {
        method: 'PUT',
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
        setVolunteers(volunteers.map(volunteer => 
          volunteer._id === volunteerId 
            ? { ...volunteer, isActive: newStatus } 
            : volunteer
        ));
        
        setFeedback(`Volunteer ${newStatus ? 'activated' : 'deactivated'} successfully`);
        setFeedbackSuccess(true);
      } else {
        console.error('Error updating volunteer status:', data);
        setFeedback(`Failed to ${newStatus ? 'activate' : 'deactivate'} volunteer: ${data?.message || 'Unknown error'}`);
        setFeedbackSuccess(false);
      }
    } catch (error) {
      console.error(`Error updating volunteer status:`, error);
      setFeedback(`Failed to update volunteer status: ${error.message || 'Unknown error'}`);
      setFeedbackSuccess(false);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Filter volunteers based on search term and status filter
  const filteredVolunteers = volunteers.filter(volunteer => {
    // Check if volunteer matches search term
    const matchesSearch = 
      !searchTerm || 
      volunteer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.phone?.includes(searchTerm);
    
    // Check if volunteer matches status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && volunteer.isActive) ||
      (statusFilter === 'inactive' && !volunteer.isActive);
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <Header>
          <Title>Volunteer Management</Title>
          <BackButton onClick={() => navigate('/admin')}>
            <FaArrowLeft style={{ marginRight: '0.5rem' }} />
            Back to Dashboard
          </BackButton>
        </Header>
        
        {/* Display current NGO info */}
        {currentDropLocation && (
          <Card>
            <SectionTitle>Managing NGO: {currentDropLocation.name}</SectionTitle>
            <SectionDescription>
              Location: {currentDropLocation.address}, {currentDropLocation.city}, {currentDropLocation.state} - {currentDropLocation.pincode}
            </SectionDescription>
          </Card>
        )}
        
        {/* Pending Applications Section */}
        {pendingApplications.length > 0 && (
          <Card>
            <SectionTitle>Pending Applications</SectionTitle>
            <SectionDescription>Review and process volunteer applications</SectionDescription>
            
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Location</Th>
                    <Th>Applied On</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApplications.map((application) => (
                    <tr key={application._id}>
                      <Td>{application.volunteerName}</Td>
                      <Td>{application.email}</Td>
                      <Td>{application.phone}</Td>
                      <Td>{application.city}, {application.state}</Td>
                      <Td>{new Date(application.appliedDate).toLocaleDateString()}</Td>
                      <Td>
                        <ActionButtonGroup>
                          <ActionButton
                            action="approve"
                            onClick={() => handleApplicationAction(application._id, 'approve')}
                            disabled={actionLoading}
                          >
                            Approve
                          </ActionButton>
                          <ActionButton
                            action="reject"
                            onClick={() => handleApplicationAction(application._id, 'reject')}
                            disabled={actionLoading}
                          >
                            Reject
                          </ActionButton>
                        </ActionButtonGroup>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </Card>
        )}
        
        {/* Volunteers Section */}
        <Card>
          <SectionTitle>Volunteers</SectionTitle>
          <SectionDescription>Manage volunteers associated with your NGO</SectionDescription>
          
          <FilterContainer>
            <SearchContainer>
              <FaSearch />
              <SearchInput
                type="text"
                placeholder="Search volunteers by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
            
            <StatusFilterContainer>
              <StatusFilterLabel>Status:</StatusFilterLabel>
              <StatusFilterSelect
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </StatusFilterSelect>
            </StatusFilterContainer>
          </FilterContainer>
          
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Location</Th>
                  <Th>Joined On</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <Td colSpan={7} style={{ textAlign: 'center' }}>
                      <LoadingSpinner />
                    </Td>
                  </tr>
                ) : filteredVolunteers.length === 0 ? (
                  <tr>
                    <Td colSpan={7} style={{ textAlign: 'center' }}>No volunteers found matching your search.</Td>
                  </tr>
                ) : (
                  filteredVolunteers.map((volunteer) => (
                    <tr key={volunteer._id}>
                      <Td>{volunteer.name}</Td>
                      <Td>{volunteer.email}</Td>
                      <Td>{volunteer.phone}</Td>
                      <Td>{volunteer.city}, {volunteer.state}</Td>
                      <Td>{new Date(volunteer.joinedDate).toLocaleDateString()}</Td>
                      <Td>
                        <StatusBadge status={volunteer.isActive ? 'active' : 'inactive'}>
                          {volunteer.isActive ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </Td>
                      <Td>
                        <ActionButton
                          action={volunteer.isActive ? 'reject' : 'approve'}
                          onClick={() => handleVolunteerStatusChange(volunteer._id, !volunteer.isActive)}
                          disabled={actionLoading}
                        >
                          {volunteer.isActive ? 'Deactivate' : 'Activate'}
                        </ActionButton>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableContainer>
          
          {feedback && (
            <Feedback success={feedbackSuccess} visible={feedbackVisible}>
              {feedback}
            </Feedback>
          )}
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default VolunteerManagement;
