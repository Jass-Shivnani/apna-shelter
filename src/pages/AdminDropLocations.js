import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { adminService, geocodeService } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

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

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const Title = styled.h1`
  color: #344767;
  font-size: 2rem;
`;

const Button = styled.button`
  background: ${props => props.primary ? '#007DBC' : 'white'};
  color: ${props => props.primary ? 'white' : '#666'};
  border: 1px solid ${props => props.primary ? '#007DBC' : '#ddd'};
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.primary ? '#0069a3' : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LocationsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const LocationCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  border-left: 4px solid ${props => props.active ? '#4CAF50' : '#ff5252'};
  
  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const LocationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const LocationName = styled.h3`
  color: #344767;
  margin: 0;
  font-size: 1.2rem;
`;

const LocationStatus = styled.span`
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  background: ${props => props.active ? '#e8f5e9' : '#ffebee'};
  color: ${props => props.active ? '#4CAF50' : '#ff5252'};
`;

const LocationDetails = styled.div`
  margin-bottom: 1rem;
`;

const LocationDetail = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  
  svg {
    margin-right: 0.5rem;
    margin-top: 0.2rem;
    color: #666;
  }
`;

const LocationActions = styled.div`
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #666;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007DBC;
  }
`;

const MapContainer = styled.div`
  height: 300px;
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
`;

const ErrorMessage = styled.div`
  color: #ff5252;
  font-size: 0.8rem;
  margin-top: 0.2rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const AdminDropLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pincode: '',
    coordinates: [0, 0], // [longitude, latitude]
    timings: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const [mapPosition, setMapPosition] = useState({ lat: 19.0760, lng: 72.8777 }); // Default to Mumbai
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Load Google Maps API directly
  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }
    
    // Load Google Maps API
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    
    // Handle script load success
    googleMapScript.addEventListener('load', () => {
      setMapsLoaded(true);
    });
    
    // Handle script load error
    googleMapScript.addEventListener('error', () => {
      setLoadError(true);
    });
    
    document.body.appendChild(googleMapScript);
    
    return () => {
      // Clean up script tag on component unmount
      if (googleMapScript.parentNode) {
        googleMapScript.parentNode.removeChild(googleMapScript);
      }
    };
  }, []);
  
  // Fetch all drop locations
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllDropLocations();
      if (response.success) {
        setLocations(response.data);
      } else {
        alert('Error fetching drop locations');
      }
    } catch (error) {
      console.error('Error fetching drop locations:', error);
      alert('Error fetching drop locations');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLocations();
  }, []);
  
  // Open modal for creating a new location
  const handleAddLocation = () => {
    setEditingLocation(null);
    setFormData({
      name: '',
      address: '',
      pincode: '',
      coordinates: [0, 0],
      timings: '',
      isActive: true
    });
    setMapPosition({ lat: 19.0760, lng: 72.8777 });
    setShowModal(true);
  };
  
  // Open modal for editing an existing location
  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      pincode: location.pincode,
      coordinates: location.coordinates,
      timings: location.timings,
      isActive: location.isActive
    });
    setMapPosition({ 
      lat: location.coordinates[1], 
      lng: location.coordinates[0] 
    });
    setShowModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Initialize map when modal is shown
  const initMap = useCallback(() => {
    if (!mapsLoaded || !document.getElementById('location-map')) return;
    
    // Create map instance
    const mapOptions = {
      center: mapPosition,
      zoom: 15,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false
    };
    
    const map = new window.google.maps.Map(document.getElementById('location-map'), mapOptions);
    mapRef.current = map;
    
    // Create marker
    const marker = new window.google.maps.Marker({
      position: mapPosition,
      map: map,
      animation: window.google.maps.Animation.DROP,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
    markerRef.current = marker;
    
    // Add click event listener
    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      setMapPosition({ lat, lng });
      marker.setPosition({ lat, lng });
      
      setFormData(prev => ({
        ...prev,
        coordinates: [lng, lat] // MongoDB uses [longitude, latitude]
      }));
      
      // Get address from coordinates
      geocodeService.reverseGeocode(lat, lng)
        .then(response => {
          if (response.data) {
            const addressData = response.data;
            setFormData(prev => ({
              ...prev,
              address: addressData.address,
              pincode: addressData.zipcode || prev.pincode
            }));
          }
        })
        .catch(error => {
          console.error('Error getting address:', error);
        });
    });
    
    // Create search box
    const input = document.getElementById('location-search-box');
    if (input) {
      const searchBox = new window.google.maps.places.SearchBox(input);
      
      // Bias the SearchBox results towards current map's viewport
      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
      });
      
      // Listen for the event fired when the user selects a prediction
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        
        if (places && places.length > 0) {
          const place = places[0];
          
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            setMapPosition({ lat, lng });
            marker.setPosition({ lat, lng });
            map.panTo({ lat, lng });
            map.setZoom(16);
            
            setFormData(prev => ({
              ...prev,
              coordinates: [lng, lat],
              address: place.formatted_address || prev.address,
              pincode: place.address_components?.find(c => c.types.includes('postal_code'))?.long_name || prev.pincode
            }));
          }
        }
      });
    }
  }, [mapsLoaded, mapPosition]);
  
  // Initialize map when modal is shown and maps are loaded
  useEffect(() => {
    if (showModal && mapsLoaded) {
      // Small delay to ensure the DOM is ready
      const timer = setTimeout(() => {
        initMap();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [showModal, mapsLoaded, initMap]);
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'PIN code must be 6 digits';
    if (!formData.timings.trim()) newErrors.timings = 'Operating hours are required';
    if (!formData.coordinates || formData.coordinates[0] === 0 && formData.coordinates[1] === 0) {
      newErrors.coordinates = 'Please select a location on the map';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      let response;
      
      if (editingLocation) {
        // Update existing location
        response = await adminService.updateDropLocation(editingLocation._id, formData);
      } else {
        // Create new location
        response = await adminService.createDropLocation(formData);
      }
      
      if (response.success) {
        setShowModal(false);
        fetchLocations();
      } else {
        alert(response.message || 'Error saving drop location');
      }
    } catch (error) {
      console.error('Error saving drop location:', error);
      alert('Error saving drop location');
    }
  };
  
  // Handle location deletion
  const handleDeleteLocation = async (id) => {
    if (window.confirm('Are you sure you want to delete this drop location?')) {
      try {
        const response = await adminService.deleteDropLocation(id);
        
        if (response.success) {
          fetchLocations();
        } else {
          alert(response.message || 'Error deleting drop location');
        }
      } catch (error) {
        console.error('Error deleting drop location:', error);
        alert('Error deleting drop location');
      }
    }
  };
  
  // Handle toggling location active status
  const handleToggleStatus = async (id) => {
    try {
      const response = await adminService.toggleDropLocationStatus(id);
      
      if (response.success) {
        fetchLocations();
      } else {
        alert(response.message || 'Error toggling drop location status');
      }
    } catch (error) {
      console.error('Error toggling drop location status:', error);
      alert('Error toggling drop location status');
    }
  };
  
  // Navigate back to dashboard
  const handleBack = () => {
    window.history.back();
  };
  
  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <PageHeader>
          <HeaderLeft>
            <BackButton onClick={handleBack}>
              <FaArrowLeft /> Back to Dashboard
            </BackButton>
            <Title>Manage Drop Locations</Title>
          </HeaderLeft>
          <Button primary onClick={handleAddLocation}>
            <FaPlus /> Add New Location
          </Button>
        </PageHeader>
        
        {loading ? (
          <div>Loading drop locations...</div>
        ) : (
          <LocationsGrid>
            {locations.map(location => (
              <LocationCard key={location._id} active={location.isActive}>
                <LocationHeader>
                  <LocationName>{location.name}</LocationName>
                  <LocationStatus active={location.isActive}>
                    {location.isActive ? 'Active' : 'Inactive'}
                  </LocationStatus>
                </LocationHeader>
                
                <LocationDetails>
                  <LocationDetail>
                    <FaMapMarkerAlt />
                    <div>
                      <div>{location.address}</div>
                      <div>PIN: {location.pincode}</div>
                    </div>
                  </LocationDetail>
                  <LocationDetail>
                    <span>Hours: {location.timings}</span>
                  </LocationDetail>
                </LocationDetails>
                
                <LocationActions>
                  <ActionButton 
                    onClick={() => handleToggleStatus(location._id)}
                    color={location.isActive ? '#4CAF50' : '#ff5252'}
                    title={location.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {location.isActive ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                  </ActionButton>
                  <ActionButton 
                    onClick={() => handleEditLocation(location)}
                    color="#007DBC"
                    title="Edit"
                  >
                    <FaEdit />
                  </ActionButton>
                  <ActionButton 
                    onClick={() => handleDeleteLocation(location._id)}
                    color="#ff5252"
                    title="Delete"
                  >
                    <FaTrash />
                  </ActionButton>
                </LocationActions>
              </LocationCard>
            ))}
          </LocationsGrid>
        )}
      </Container>
      
      {/* Modal for adding/editing drop locations */}
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingLocation ? 'Edit Drop Location' : 'Add New Drop Location'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Location Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Apna Shelter Main Center"
                />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label>Search for a location</Label>
                <Input
                  id="location-search-box"
                  type="text"
                  placeholder="Search for an address"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Select Location on Map</Label>
                <MapContainer>
                  <div id="location-map" style={{ height: '100%', width: '100%' }}></div>
                </MapContainer>
                {errors.coordinates && <ErrorMessage>{errors.coordinates}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label>Address</Label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full address"
                />
                {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label>PIN Code</Label>
                <Input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit PIN code"
                  maxLength={6}
                />
                {errors.pincode && <ErrorMessage>{errors.pincode}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label>Operating Hours</Label>
                <Input
                  type="text"
                  name="timings"
                  value={formData.timings}
                  onChange={handleInputChange}
                  placeholder="e.g., 9:00 AM - 6:00 PM"
                />
                {errors.timings && <ErrorMessage>{errors.timings}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  {' '}Active
                </Label>
              </FormGroup>
              
              <ModalActions>
                <Button type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" primary>Save</Button>
              </ModalActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </PageWrapper>
  );
};

export default AdminDropLocations;
