import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from '../components/Navbar';
import { MapContainer as MapComponent, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #FFF4E0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 2rem;
  height: auto;
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 600px; /* Fixed height for consistency across all form steps */
`;

const ImageSection = styled.div`
  position: relative;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('/images/donation-hero.png') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: white;
  height: 100%;
`;

const FormSection = styled.div`
  padding: 3rem;
  background: white;
  overflow-y: auto; /* Add scrolling for content that exceeds the fixed height */
  height: 100%;
`;

const HeroText = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  line-height: 1.2;
  max-width: 500px;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  color: #344767;
  margin-bottom: 2rem;
  font-family: 'Roboto', sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
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

const PhoneInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  
  span {
    padding: 0.8rem;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #666;
  }
  
  input {
    flex: 1;
  }
`;

const DeliveryOptions = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #DEE2E6;
  border-radius: 50px;
  padding: 4px;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 20%;
    bottom: 20%;
    width: 1px;
    background-color: #ddd;
  }
`;

const DeliveryOption = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 50px;
  background: transparent;
  color: ${props => props.selected ? '#000' : '#666'};
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 1rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 5px;
    right: 5px;
    height: 3px;
    background: #007DBC;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  ${props => props.selected && `
    &:after {
      transform: scaleX(1);
    }
  `}

  &:last-child {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.8rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const CancelButton = styled(Button)`
  background: white;
  border: 1px solid #ddd;
  color: #666;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const ContinueButton = styled(Button)`
  background: #003669;
  border: none;
  color: white;
  
  &:hover {
    background: #002850;
  }
`;

const BackButton = styled(Button)`
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 0.2rem;
`;

const FileUploadContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const FileUploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  
  &:hover {
    border-color: #007DBC;
    background-color: #f0f8ff;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  margin-bottom: 0.5rem;
  color: #007DBC;
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const UploadText = styled.div`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
`;

const ImagePreviewContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #007DBC;
  }
`;

const SubmitButton = styled.button`
  background-color: #007DBC;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #0069a3;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  height: 100%;
  text-align: center;
`;

const SuccessIconContainer = styled.div`
  size: 150px;
  border-radius: 50%;
  background-color: #f0f8ff;
  display: block;
  align-items: center;
  justify-content: center;
  animation: ${keyframes`
    0% {
      box-shadow: 0 0 0 0 rgba(0, 125, 188, 0.4);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(0, 125, 188, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 125, 188, 0);
    }
  `} 2s infinite;
`;

const checkmarkAnimation = keyframes`
  0% {
    stroke-dashoffset: 100;
    opacity: 0;
    transform: scale(0.8);
  }
  60% {
    stroke-dashoffset: 0;
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CheckmarkCircle = styled.circle`
  fill: none;
  stroke: #007DBC;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: ${checkmarkAnimation} 1.5s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  animation-delay: 0.2s;
`;

const CheckmarkPath = styled.path`
  fill: none;
  stroke: #007DBC;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-miterlimit: 10;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: ${checkmarkAnimation} 1.5s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  animation-delay: 0.8s;
`;

const SuccessTitle = styled.h2`
  font-size: 2.5rem;
  color: #007DBC;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 1.2s;
  opacity: 0;
`;

const SuccessText = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 0.5rem;
  line-height: 1.6;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: ${props => props.delay || '1.4s'};
  opacity: 0;
  max-width: 80%;
`;

const SuccessDetails = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 1.8s;
  opacity: 0;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #666;
`;

const DetailValue = styled.span`
  color: #333;
`;

const LocationCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &.selected {
    border-left: 4px solid #007DBC;
    background-color: #f0f8ff;
  }
`;

const LocationName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 1rem;
  color: #333;
`;

const LocationAddress = styled.p`
  margin: 0 0 5px 0;
  font-size: 0.9rem;
  color: #666;
`;

const LocationTimings = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #888;
  font-style: italic;
`;

const LocationsContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
  padding-right: 10px;
`;

const NoLocationsMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
`;

const MapContainer = styled.div`
  height: 300px;
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
`;

const dropLocations = [
  {
    id: 1,
    name: "Apna Shelter Main Center",
    address: "123 Charity Road, Mumbai",
    pincode: "400001",
    coordinates: [19.0760, 72.8777],
    timings: "9:00 AM - 6:00 PM"
  },
  {
    id: 2,
    name: "Community Center Branch",
    address: "45 Hope Street, Mumbai",
    pincode: "400002",
    coordinates: [19.0825, 72.8900],
    timings: "10:00 AM - 5:00 PM"
  },
  {
    id: 3,
    name: "Eastern Mumbai Collection Point",
    address: "78 Giving Lane, Mumbai",
    pincode: "400003",
    coordinates: [19.0650, 72.8950],
    timings: "8:00 AM - 7:00 PM"
  },
  {
    id: 4,
    name: "Northern Collection Center",
    address: "22 Donation Avenue, Mumbai",
    pincode: "400004",
    coordinates: [19.0900, 72.8700],
    timings: "9:30 AM - 6:30 PM"
  },
  {
    id: 5,
    name: "Southern Mumbai Branch",
    address: "56 Charity Street, Mumbai",
    pincode: "400005",
    coordinates: [19.0500, 72.8600],
    timings: "10:00 AM - 8:00 PM"
  }
];

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
});

const FlyToLocation = ({ center, pincode, setPosition }) => {
  const map = useMap();
  const searchedRef = useRef(false);
  const zoomRef = useRef(null);
  
  // First, center on the provided coordinates
  useEffect(() => {
    if (center) {
      // Store current zoom if it exists
      if (map.getZoom()) {
        zoomRef.current = map.getZoom();
      }
      
      map.flyTo(center, zoomRef.current || 13, {
        duration: 1.5,
        animate: true
      });
    }
  }, [map, center]);
  
  // Then, search for the pincode if available
  useEffect(() => {
    const searchPincode = async () => {
      if (!pincode || searchedRef.current) return;
      
      try {
        // Search for the pincode location
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pincode + ' India')}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newPosition = [parseFloat(lat), parseFloat(lon)];
          
          // Update the marker position
          setPosition(newPosition);
          
          // Fly to the found location with maximum zoom (18 is typically the max for most areas)
          map.flyTo(newPosition, 18, {
            duration: 1.5,
            animate: true
          });
          
          // Store this zoom level
          zoomRef.current = 18;
          
          // Mark as searched so we don't search again
          searchedRef.current = true;
          
          console.log(`Found location for pincode ${pincode}: ${data[0].display_name}`);
        } else {
          console.log(`No location found for pincode ${pincode}`);
        }
      } catch (error) {
        console.error('Error searching for pincode location:', error);
      }
    };
    
    searchPincode();
  }, [map, pincode, setPosition]);
  
  return null;
};

const MapClickHandler = ({ onMapClick }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    map.on('click', onMapClick);
    
    return () => {
      map.off('click', onMapClick);
    };
  }, [map, onMapClick]);
  
  return null;
};

const DonationForm = () => {
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    pinCode: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    items: '',
    notes: '',
    photoVerification: null,
    selectedDropLocation: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [mapPosition, setMapPosition] = useState([19.0760, 72.8777]); // Mumbai coordinates
  const [nearbyDropLocations, setNearbyDropLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [showingDropLocations, setShowingDropLocations] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photoVerification: file
      }));
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      
      // Clear error if it exists
      if (errors.photoVerification) {
        setErrors(prev => ({
          ...prev,
          photoVerification: ''
        }));
      }
    }
  };

  const handleDeliveryChange = (method) => {
    setDeliveryMethod(method);
  };

  const findNearbyDropLocations = (pincode) => {
    // In a real application, this would be an API call to get locations near the pincode
    // For this demo, we'll filter our mock data to simulate finding nearby locations
    
    // First, find the coordinates for the entered pincode
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pincode + ' India')}`;
    
    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          
          // Find "nearby" drop locations (in a real app, this would use distance calculations)
          // For demo purposes, we'll just show all locations but sort them by a simulated "distance"
          const locationsWithDistance = dropLocations.map(location => {
            // Calculate a simple distance (not accurate, just for demo)
            const dlat = location.coordinates[0] - lat;
            const dlon = location.coordinates[1] - lon;
            const distance = Math.sqrt(dlat * dlat + dlon * dlon);
            
            return {
              ...location,
              distance
            };
          });
          
          // Sort by distance and take the closest 5
          const sortedLocations = locationsWithDistance
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);
          
          setNearbyDropLocations(sortedLocations);
          setShowingDropLocations(true);
          
          // If there are locations, select the first one by default
          if (sortedLocations.length > 0) {
            handleSelectDropLocation(sortedLocations[0].id);
          }
        } else {
          console.log('No location found for pincode:', pincode);
          setNearbyDropLocations([]);
          setShowingDropLocations(true);
        }
      })
      .catch(error => {
        console.error('Error searching for pincode location:', error);
        setNearbyDropLocations([]);
        setShowingDropLocations(true);
      });
  };

  const handleSelectDropLocation = (locationId) => {
    setSelectedLocationId(locationId);
    
    // Find the selected location and update form data
    const selectedLocation = nearbyDropLocations.find(loc => loc.id === locationId);
    if (selectedLocation) {
      setFormData(prev => ({
        ...prev,
        selectedDropLocation: selectedLocation
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber.trim())) {
      newErrors.contactNumber = 'Please enter a valid 10-digit contact number';
    }
    
    if (!formData.photoVerification) {
      newErrors.photoVerification = 'Please upload a photo for verification';
    }
    
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = 'Pin code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      newErrors.pinCode = 'Please enter a valid 6-digit pin code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (deliveryMethod === 'pickup') {
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      
      if (!formData.state.trim()) {
        newErrors.state = 'State is required';
      }
      
      if (!formData.items.trim()) {
        newErrors.items = 'Please describe the food you wish to donate';
      }
    } else if (deliveryMethod === 'drop') {
      if (!formData.selectedDropLocation) {
        newErrors.selectedDropLocation = 'Please select a drop location';
      }
      
      if (!formData.items.trim()) {
        newErrors.items = 'Please describe the food you wish to donate';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (validateStep1()) {
        if (deliveryMethod === 'drop' && formData.pinCode) {
          // Find nearby drop locations based on pincode
          findNearbyDropLocations(formData.pinCode);
        }
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep2()) {
      console.log('Form submitted:', formData);
      setCurrentStep(3);
    }
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setMapPosition([lat, lng]);
    
    // Reverse geocode to get address details
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.address) {
          const address = data.address;
          
          // Update form data with address details
          setFormData(prev => ({
            ...prev,
            address: data.display_name.split(',').slice(0, 3).join(', ') || '',
            city: address.city || address.town || address.village || '',
            state: address.state || '',
            pinCode: address.postcode || prev.pinCode
          }));
        }
      })
      .catch(error => {
        console.error('Error reverse geocoding:', error);
      });
  };

  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <Card>
          <ImageSection>
            <HeroText>We Can Save The Future</HeroText>
          </ImageSection>
          <FormSection>
            <FormTitle>Donation Form</FormTitle>
            {currentStep === 3 ? (
              <SuccessMessage>
                <SuccessIconContainer>
                  <svg width="80" height="80" viewBox="0 0 50 50">
                    <CheckmarkCircle cx="25" cy="25" r="22" />
                    <CheckmarkPath d="M14,27 L22,35 L36,15" />
                  </svg>
                </SuccessIconContainer>
                
                <SuccessTitle>Thank You!</SuccessTitle>
                <SuccessText>Your donation request has been submitted successfully.</SuccessText>
                <SuccessText delay="1.6s">
                  {deliveryMethod === 'pickup' ? (
                    'We will arrange a pickup from your location soon. Our team will contact you at the provided number to confirm the details.'
                  ) : (
                    `Please drop your items at the selected location: ${formData.selectedDropLocation?.name}. The center is open during ${formData.selectedDropLocation?.timings}.`
                  )}
                </SuccessText>
                
                <SuccessDetails>
                  {deliveryMethod === 'pickup' ? (
                    <>
                      <DetailItem>
                        <DetailLabel>Contact:</DetailLabel>
                        <DetailValue>{formData.contactNumber}</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Pincode:</DetailLabel>
                        <DetailValue>{formData.pinCode}</DetailValue>
                      </DetailItem>
                    </>
                  ) : (
                    <>
                      <DetailItem>
                        <DetailLabel>Drop Location:</DetailLabel>
                        <DetailValue>{formData.selectedDropLocation?.name}</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Address:</DetailLabel>
                        <DetailValue>{formData.selectedDropLocation?.address}</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Timings:</DetailLabel>
                        <DetailValue>{formData.selectedDropLocation?.timings}</DetailValue>
                      </DetailItem>
                    </>
                  )}
                  <DetailItem>
                    <DetailLabel>Reference ID:</DetailLabel>
                    <DetailValue>#{Math.floor(100000 + Math.random() * 900000)}</DetailValue>
                  </DetailItem>
                </SuccessDetails>
              </SuccessMessage>
            ) : currentStep === 1 ? (
              <Form onSubmit={handleNextStep}>
                <InputGroup>
                  <Label>Full Name</Label>
                  <Input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name" 
                  />
                  {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
                </InputGroup>
                
                <InputGroup>
                  <Label>Contact Number</Label>
                  <PhoneInputGroup>
                    <span>+91</span>
                    <Input 
                      type="tel" 
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="1234567890" 
                    />
                  </PhoneInputGroup>
                  {errors.contactNumber && <ErrorMessage>{errors.contactNumber}</ErrorMessage>}
                </InputGroup>
                
                <InputGroup>
                  <Label>Photo Verification</Label>
                  <FileUploadContainer>
                    <FileUploadLabel>
                      <FileInput 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                      />
                      <UploadIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                      </UploadIcon>
                      <UploadText>
                        {photoPreview ? 'Change photo' : 'Upload a photo of the food you wish to donate'}
                        <br />
                        <small>Click to browse or drag and drop</small>
                      </UploadText>
                    </FileUploadLabel>
                    {photoPreview && (
                      <ImagePreviewContainer>
                        <ImagePreview src={photoPreview} alt="Preview" />
                      </ImagePreviewContainer>
                    )}
                    {errors.photoVerification && <ErrorMessage>{errors.photoVerification}</ErrorMessage>}
                  </FileUploadContainer>
                </InputGroup>
                
                <InputGroup>
                  <Label>Delivery Method</Label>
                  <DeliveryOptions>
                    <DeliveryOption 
                      type="button"
                      selected={deliveryMethod === 'pickup'}
                      onClick={() => handleDeliveryChange('pickup')}
                    >
                      Pickup
                    </DeliveryOption>
                    <DeliveryOption
                      type="button"
                      selected={deliveryMethod === 'drop'}
                      onClick={() => handleDeliveryChange('drop')}
                    >
                      Drop yourself <span>💝</span>
                    </DeliveryOption>
                  </DeliveryOptions>
                </InputGroup>
                
                <InputGroup>
                  <Label>Pin Code</Label>
                  <Input 
                    type="text" 
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    placeholder="Enter your pin code" 
                  />
                  {errors.pinCode && <ErrorMessage>{errors.pinCode}</ErrorMessage>}
                </InputGroup>
                
                <ButtonGroup>
                  <CancelButton type="button">Cancel</CancelButton>
                  <ContinueButton type="submit">Continue</ContinueButton>
                </ButtonGroup>
              </Form>
            ) : (
              <Form onSubmit={handleSubmit}>
                {deliveryMethod === 'pickup' ? (
                  <>
                    <InputGroup>
                      <Label>Pin your location on the map</Label>
                      <MapContainer>
                        <MapComponent 
                          center={mapPosition} 
                          zoom={13} 
                          style={{ height: '100%', width: '100%' }}
                        >
                          <FlyToLocation position={mapPosition} pincode={formData.pinCode} setPosition={setMapPosition} />
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Marker position={mapPosition}>
                            <Popup>
                              Your pickup location
                            </Popup>
                          </Marker>
                          <MapClickHandler onMapClick={handleMapClick} />
                        </MapComponent>
                      </MapContainer>
                    </InputGroup>
                    
                    <InputGroup>
                      <Label>Address</Label>
                      <Input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your full address" 
                      />
                      {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
                    </InputGroup>
                    
                    <InputGroup>
                      <Label>Landmark (Optional)</Label>
                      <Input 
                        type="text" 
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder="Any nearby landmark" 
                      />
                    </InputGroup>
                    
                    <InputGroup>
                      <Label>City</Label>
                      <Input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city" 
                      />
                      {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
                    </InputGroup>
                    
                    <InputGroup>
                      <Label>State</Label>
                      <Input 
                        type="text" 
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter your state" 
                      />
                      {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
                    </InputGroup>
                    
                    <InputGroup>
                      <Label>Food Description</Label>
                      <TextArea
                        name="items"
                        value={formData.items}
                        onChange={handleInputChange}
                        placeholder="Describe the food you wish to donate (e.g., rice, dal, vegetables, etc.)"
                      />
                      {errors.items && <ErrorMessage>{errors.items}</ErrorMessage>}
                    </InputGroup>
                    
                    <InputGroup>
                      <Label>Additional Notes (Optional)</Label>
                      <TextArea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any additional information about your donation"
                      />
                    </InputGroup>
                  </>
                ) : (
                  <>
                    <InputGroup>
                      <Label>Pin Code</Label>
                      <Input
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        placeholder="Enter your pin code"
                      />
                      {errors.pinCode && <ErrorMessage>{errors.pinCode}</ErrorMessage>}
                      <ButtonGroup style={{ marginTop: '0.5rem' }}>
                        <ContinueButton 
                          type="button" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (formData.pinCode) {
                              findNearbyDropLocations(formData.pinCode);
                            } else {
                              setErrors(prev => ({...prev, pinCode: 'Please enter a valid pin code'}));
                            }
                          }}
                          style={{ padding: '0.5rem' }}
                        >
                          Find Nearby Drop Locations
                        </ContinueButton>
                      </ButtonGroup>
                    </InputGroup>
                    
                    <InputGroup>
                      <Label>Select a Drop Location</Label>
                      {nearbyDropLocations.length > 0 ? (
                        <LocationsContainer>
                          {nearbyDropLocations.map(location => (
                            <LocationCard 
                              key={location.id}
                              className={selectedLocationId === location.id ? 'selected' : ''}
                              onClick={() => handleSelectDropLocation(location.id)}
                            >
                              <LocationName>{location.name}</LocationName>
                              <LocationAddress>{location.address}</LocationAddress>
                              <LocationTimings>Open: {location.timings}</LocationTimings>
                            </LocationCard>
                          ))}
                        </LocationsContainer>
                      ) : (
                        <NoLocationsMessage>
                          {showingDropLocations ? 
                            'No drop locations found near your pincode. Please try a different pincode.' : 
                            'Enter your pincode and click "Find Nearby Drop Locations" to see available drop-off centers.'}
                        </NoLocationsMessage>
                      )}
                      {errors.selectedDropLocation && <ErrorMessage>{errors.selectedDropLocation}</ErrorMessage>}
                    </InputGroup>
                    
                    <InputGroup>
                      <Label>Food Description</Label>
                      <TextArea
                        name="items"
                        value={formData.items}
                        onChange={handleInputChange}
                        placeholder="Describe the food you wish to donate (e.g., rice, dal, vegetables, etc.)"
                      />
                      {errors.items && <ErrorMessage>{errors.items}</ErrorMessage>}
                    </InputGroup>
                    
                    <InputGroup>
                      <Label>Additional Notes (Optional)</Label>
                      <TextArea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any additional information about your donation"
                      />
                    </InputGroup>
                  </>
                )}
                
                <ButtonGroup>
                  <BackButton type="button" onClick={() => setCurrentStep(1)}>Back</BackButton>
                  <SubmitButton type="submit">Submit</SubmitButton>
                </ButtonGroup>
              </Form>
            )}
          </FormSection>
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default DonationForm;
