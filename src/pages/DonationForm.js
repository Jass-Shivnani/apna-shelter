import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from '../components/Navbar';
import { FaMapMarkerAlt, FaExclamationTriangle, FaPlus, FaTrash } from 'react-icons/fa';
import { donationService, geocodeService } from '../services/api';

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
  padding: 2rem;
  background: white;
  overflow-y: auto;
  height: 100%;
  
  /* Prevent horizontal scrolling */
  overflow-x: hidden;
  
  /* Add some breathing room at the bottom */
  padding-bottom: 3rem;
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

const SubmitButton = styled(Button)`
  background: #007DBC;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #006ba3;
  }
  
  ${props => props.isSubmitting && `
    opacity: 0.7;
    cursor: not-allowed;
    
    &:after {
      content: '';
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid white;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s linear infinite;
    }
  `}
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

const Circle = styled.circle`
  fill: none;
  stroke: #007DBC;
  stroke-width: 3;
  stroke-dasharray: 440;
  stroke-dashoffset: 440;
  animation: ${checkmarkAnimation} 1.5s ease-in-out forwards;
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

const DonationDetails = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
  width: 100%;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  
  &:last-child {
    margin-bottom: 0;
  }
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
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    border-left-color: #007DBC;
  }
  
  &.selected {
    border-left-color: #007DBC;
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

const LocationDetail = styled.p`
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

const LoadingMessage = styled.div`
  color: #007DBC;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:before {
    content: '';
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid #007DBC;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ItemCard = styled.div`
  background: white;
  border-radius: 50px;
  padding: 15px 25px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 20px;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ItemName = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
`;

const ItemQuantity = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  text-align: right;
`;

const ItemUnit = styled.div`
  font-size: 1.1rem;
  color: #333;
  min-width: 60px;
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007DBC;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: #ff5252;
  }
`;

const AddItemButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 50px;
  padding: 12px 20px;
  width: 100%;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
  
  &:hover {
    background: #eaeaea;
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
  border-radius: 12px;
  padding: 25px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  color: #344767;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const CancelModalButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #666;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const SaveModalButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #007DBC;
  color: white;
  cursor: pointer;
  
  &:hover {
    background: #0069a3;
  }
`;

const MapComponent = ({ position: initialPosition, setPosition, onMapClick }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const searchBoxRef = useRef(null);
  const [searchBox, setSearchBox] = useState(null);
  const positionRef = useRef(initialPosition);
  
  // Load Google Maps API directly with script tag instead of using the hook
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  // Use a ref to track position instead of state to prevent re-renders
  useEffect(() => {
    positionRef.current = initialPosition;
    
    // Only update marker position if map is already initialized
    if (mapsLoaded && mapRef.current && markerRef.current) {
      markerRef.current.setPosition(initialPosition);
    }
  }, [initialPosition, mapsLoaded]);
  
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
  
  // Initialize map only once when the Google Maps API is loaded
  useEffect(() => {
    if (!mapsLoaded || !document.getElementById('google-map')) return;
    
    // Create map instance
    const mapOptions = {
      center: positionRef.current || { lat: 19.0760, lng: 72.8777 }, // Default to Mumbai
      zoom: 18,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false
    };
    
    const map = new window.google.maps.Map(document.getElementById('google-map'), mapOptions);
    mapRef.current = map;
    
    // Create marker if position exists
    if (positionRef.current) {
      const marker = new window.google.maps.Marker({
        position: positionRef.current,
        map: map,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });
      markerRef.current = marker;
    }
    
    // Add click event listener to map
    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newPosition = { lat, lng };
      
      // Update marker position or create new marker
      if (markerRef.current) {
        markerRef.current.setPosition(newPosition);
      } else {
        const marker = new window.google.maps.Marker({
          position: newPosition,
          map: map,
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });
        markerRef.current = marker;
      }
      
      // Update the position ref and call the callback
      positionRef.current = newPosition;
      setPosition(newPosition);
      onMapClick(newPosition);
    });
    
    // Create search box
    const input = document.getElementById('map-search-box');
    if (input) {
      const searchBoxInstance = new window.google.maps.places.SearchBox(input);
      searchBoxRef.current = searchBoxInstance;
      setSearchBox(searchBoxInstance);
      
      // Bias the SearchBox results towards current map's viewport
      map.addListener('bounds_changed', () => {
        searchBoxInstance.setBounds(map.getBounds());
      });
      
      // Listen for the event fired when the user selects a prediction
      searchBoxInstance.addListener('places_changed', () => {
        const places = searchBoxInstance.getPlaces();
        
        if (places && places.length > 0) {
          const place = places[0];
          
          if (place.geometry && place.geometry.location) {
            const newPosition = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            
            // Update marker position or create new marker
            if (markerRef.current) {
              markerRef.current.setPosition(newPosition);
            } else {
              const marker = new window.google.maps.Marker({
                position: newPosition,
                map: map,
                animation: window.google.maps.Animation.DROP,
                icon: {
                  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40)
                }
              });
              markerRef.current = marker;
            }
            
            // Center the map on the selected location
            map.panTo(newPosition);
            map.setZoom(19);
            
            // Update the position ref and call the callback
            positionRef.current = newPosition;
            setPosition(newPosition);
            onMapClick(newPosition);
          }
        }
      });
    }
    
    // This effect should only run once when the map is first initialized
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapsLoaded]);
  
  if (loadError) {
    return (
      <div style={{ 
        height: '100%', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <FaExclamationTriangle size={32} color="#d9534f" />
        <p>Error loading maps. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <MapContainer>
      {mapsLoaded ? (
        <>
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '100%'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '10px', 
              left: '10px', 
              right: '10px', 
              zIndex: 10,
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
            }}>
              <input
                id="map-search-box"
                type="text"
                placeholder="Search for an address"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <div 
              id="google-map" 
              style={{ 
                height: '100%', 
                width: '100%' 
              }}
            ></div>
          </div>
        </>
      ) : (
        <div style={{ 
          height: '100%', 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <FaMapMarkerAlt size={32} color="#007DBC" />
          <p>Loading map...</p>
        </div>
      )}
    </MapContainer>
  );
};

function DonationForm() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    donationType: 'drop-off',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pinCode: '',
    coordinates: { lat: 0, lng: 0 },
    dropLocationId: '',
    foodItems: [],
    notes: ''
  });
  
  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [position, setPosition] = useState({ lat: 19.0760, lng: 72.8777 }); // Default to Mumbai
  const [dropLocations, setDropLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [showFoodItemModal, setShowFoodItemModal] = useState(false);
  const [newFoodItem, setNewFoodItem] = useState({ name: '', quantity: '', unit: 'units' });
  const [editingFoodItemId, setEditingFoodItemId] = useState(null);
  
  // Fetch drop locations when pincode changes
  useEffect(() => {
    const fetchDropLocations = async () => {
      if (formData.donationType === 'drop-off' && formData.pinCode && formData.pinCode.length === 6) {
        setIsLoadingLocations(true);
        try {
          const response = await donationService.findNearbyDropLocations(formData.pinCode);
          if (response.success) {
            setDropLocations(response.data);
          } else {
            setDropLocations([]);
          }
        } catch (error) {
          console.error('Error fetching drop locations:', error);
          setDropLocations([]);
        } finally {
          setIsLoadingLocations(false);
        }
      }
    };
    
    fetchDropLocations();
  }, [formData.donationType, formData.pinCode]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Special handling for PIN code in drop-off mode
    if (name === 'pinCode' && formData.donationType === 'drop-off' && value.length === 6) {
      // Reset drop location selection when PIN code changes
      setFormData(prev => ({
        ...prev,
        dropLocationId: ''
      }));
    }
  };
  
  // Handle delivery method change
  const handleDeliveryChange = (method) => {
    setFormData(prevData => ({ ...prevData, donationType: method }));
  };
  
  // Handle map click
  const handleMapClick = async (position) => {
    try {
      setIsLoadingLocations(true);
      // Call the reverse geocoding service
      const response = await geocodeService.reverseGeocode(position.lat, position.lng);
      
      console.log('Geocode response:', response); // Debug log
      
      if (response && response.data) {
        const addressData = response.data;
        
        // Update form data with address details
        setFormData(prev => ({
          ...prev,
          address: addressData.address || '',
          landmark: prev.landmark, // Preserve landmark if already entered
          city: addressData.city || '',
          state: addressData.state || '',
          pinCode: addressData.zipcode || '',
          coordinates: position
        }));
        
        // Clear any address-related errors
        setErrors(prev => ({
          ...prev,
          address: '',
          city: '',
          state: '',
          pinCode: ''
        }));
      }
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
      // Show error message to user
      setErrors(prev => ({
        ...prev,
        address: 'Failed to get address from map. Please enter manually.'
      }));
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      // Validate personal information
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    } else if (step === 2) {
      // Validate location information
      if (!formData.pinCode) newErrors.pinCode = 'PIN code is required';
      else if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = 'PIN code must be 6 digits';
      
      if (formData.donationType === 'pickup') {
        // Validate pickup specific fields
        if (!formData.address) newErrors.address = 'Address is required for pickup';
        if (!formData.city) newErrors.city = 'City is required for pickup';
        if (!formData.state) newErrors.state = 'State is required for pickup';
        
        if (!formData.coordinates || !formData.coordinates.lat || !formData.coordinates.lng) {
          newErrors.coordinates = 'Please select your location on the map';
        }
      } else {
        // Validate drop-off specific fields
        if (!formData.pinCode) newErrors.pinCode = 'PIN code is required for drop-off';
        if (!formData.dropLocationId) newErrors.dropLocationId = 'Please select a drop location';
      }
    } else if (step === 3) {
      // Validate food items
      if (!formData.foodItems || formData.foodItems.length === 0) {
        newErrors.foodItems = 'Please add at least one food item';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return; // Stop if validation fails
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare donation data
      const donationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        donationType: formData.donationType,
        foodItems: formData.foodItems,
        notes: formData.notes,
        pinCode: formData.pinCode,
        ...(formData.donationType === 'pickup' ? {
          address: formData.address,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          coordinates: formData.coordinates
        } : {
          dropLocationId: formData.dropLocationId
        })
      };
      
      // Submit donation to backend
      const response = await donationService.createDonation(donationData);
      
      if (response.success) {
        setIsSubmitted(true);
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          donationType: 'drop-off',
          address: '',
          landmark: '',
          city: '',
          state: '',
          pinCode: '',
          coordinates: { lat: 0, lng: 0 },
          dropLocationId: '',
          foodItems: [],
          notes: ''
        });
      } else {
        setErrors(prev => ({
          ...prev,
          submission: response.message || 'Error submitting donation'
        }));
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      setErrors(prev => ({
        ...prev,
        submission: 'Error submitting donation. Please try again later.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFoodItem = () => {
    setNewFoodItem({ name: '', quantity: '', unit: 'units' });
    setEditingFoodItemId(null);
    setShowFoodItemModal(true);
  };
  
  const editFoodItem = (id) => {
    const item = formData.foodItems.find(item => item.id === id);
    if (item) {
      setNewFoodItem({ ...item });
      setEditingFoodItemId(id);
      setShowFoodItemModal(true);
    }
  };
  
  const saveFoodItem = () => {
    if (!newFoodItem.name || !newFoodItem.quantity) {
      return; // Don't save if required fields are empty
    }
    
    if (editingFoodItemId) {
      // Update existing item
      setFormData(prev => ({
        ...prev,
        foodItems: prev.foodItems.map(item => 
          item.id === editingFoodItemId ? { ...newFoodItem, id: item.id } : item
        )
      }));
    } else {
      // Add new item
      setFormData(prev => ({
        ...prev,
        foodItems: [
          ...prev.foodItems,
          { ...newFoodItem, id: Date.now() }
        ]
      }));
    }
    
    setShowFoodItemModal(false);
  };
  
  const removeFoodItem = (id) => {
    setFormData(prev => ({
      ...prev,
      foodItems: prev.foodItems.filter(item => item.id !== id)
    }));
  };

  const handleFoodItemChange = (e) => {
    const { name, value } = e.target;
    setNewFoodItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <Card>
          <ImageSection>
            <HeroText>
              {currentStep === 1 && "Your Donation Journey Begins Here"}
              {currentStep === 2 && formData.donationType === 'pickup' && "Where Should We Pick Up?"}
              {currentStep === 2 && formData.donationType === 'drop-off' && "Choose a Drop Location"}
              {currentStep === 3 && "What Food Items Are You Donating?"}
              {currentStep === 4 && "Thank You for Your Generosity!"}
            </HeroText>
          </ImageSection>
          <FormSection>
            {isSubmitted ? (
              <SuccessMessage>
                <SuccessIconContainer>
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <Circle cx="75" cy="75" r="70" />
                    <CheckmarkPath d="M 40,75 L 65,100 L 110,50" />
                  </svg>
                </SuccessIconContainer>
                <h2>Donation Submitted Successfully!</h2>
                <p>Thank you for your generosity. Your donation will help feed those in need.</p>
                <p>We'll contact you shortly with next steps.</p>
              </SuccessMessage>
            ) : (
              <>
                <FormTitle>
                  {currentStep === 1 && "Your Information"}
                  {currentStep === 2 && formData.donationType === 'pickup' && "Pickup Details"}
                  {currentStep === 2 && formData.donationType === 'drop-off' && "Drop-off Details"}
                  {currentStep === 3 && "Food Item Details"}
                </FormTitle>
                
                {currentStep === 1 ? (
                  <Form onSubmit={(e) => {
                    e.preventDefault();
                    const isValid = validateStep(1);
                    if (isValid) setCurrentStep(2);
                  }}>
                    <InputGroup>
                      <Label>Full Name</Label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                    </InputGroup>
                    
                    <InputGroup>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                      />
                      {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                    </InputGroup>
                    
                    <InputGroup>
                      <Label>Phone Number</Label>
                      <PhoneInputGroup>
                        <span>+91</span>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your 10-digit phone number"
                          maxLength={10}
                        />
                      </PhoneInputGroup>
                      {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                    </InputGroup>
                    
                    <InputGroup>
                      <Label>Donation Method</Label>
                      <DeliveryOptions>
                        <DeliveryOption
                          type="button"
                          selected={formData.donationType === 'pickup'}
                          onClick={() => handleDeliveryChange('pickup')}
                        >
                          Pickup
                        </DeliveryOption>
                        <DeliveryOption
                          type="button"
                          selected={formData.donationType === 'drop-off'}
                          onClick={() => handleDeliveryChange('drop-off')}
                        >
                          Drop-off
                        </DeliveryOption>
                      </DeliveryOptions>
                    </InputGroup>
                    
                    <ButtonGroup>
                      <CancelButton type="button" onClick={() => window.location.href = '/'}>Cancel</CancelButton>
                      <ContinueButton type="submit">Continue</ContinueButton>
                    </ButtonGroup>
                  </Form>
                ) : currentStep === 2 ? (
                  <Form onSubmit={handleSubmit}>
                    {formData.donationType === 'pickup' ? (
                      <>
                        <InputGroup>
                          <Label>Select Your Location on Map</Label>
                          <MapContainer>
                            <MapComponent 
                              position={position}
                              setPosition={setPosition}
                              onMapClick={handleMapClick}
                            />
                          </MapContainer>
                          {errors.coordinates && <ErrorMessage>{errors.coordinates}</ErrorMessage>}
                          {isLoadingLocations && <LoadingMessage>Loading address details...</LoadingMessage>}
                        </InputGroup>
                        
                        <InputGroup>
                          <Label>Address</Label>
                          <Input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Your street address"
                          />
                          {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
                        </InputGroup>
                        
                        <InputGroup>
                          <Label>Landmark</Label>
                          <Input
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleInputChange}
                            placeholder="Nearby landmark for easy location"
                          />
                        </InputGroup>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <InputGroup>
                            <Label>City</Label>
                            <Input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="City"
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
                              placeholder="State"
                            />
                            {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
                          </InputGroup>
                        </div>
                        
                        <InputGroup>
                          <Label>PIN Code</Label>
                          <Input
                            type="text"
                            name="pinCode"
                            value={formData.pinCode}
                            onChange={handleInputChange}
                            placeholder="6-digit PIN code"
                          />
                          {errors.pinCode && <ErrorMessage>{errors.pinCode}</ErrorMessage>}
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
                          <Label>PIN Code</Label>
                          <Input
                            type="text"
                            name="pinCode"
                            value={formData.pinCode}
                            onChange={handleInputChange}
                            placeholder="Enter 6-digit PIN code"
                            maxLength={6}
                          />
                          {errors.pinCode && <ErrorMessage>{errors.pinCode}</ErrorMessage>}
                        </InputGroup>
                        
                        <InputGroup>
                          <Label>Select a Drop Location</Label>
                          {dropLocations.length > 0 ? (
                            <LocationsContainer>
                              {dropLocations.map(location => (
                                <LocationCard 
                                  key={location._id}
                                  className={formData.dropLocationId === location._id ? 'selected' : ''}
                                  onClick={() => setFormData(prev => ({...prev, dropLocationId: location._id}))}
                                >
                                  <LocationName>{location.name}</LocationName>
                                  <LocationAddress>{location.address}</LocationAddress>
                                  <LocationDetail>PIN: {location.pincode}</LocationDetail>
                                  <LocationDetail>Hours: {location.timings}</LocationDetail>
                                </LocationCard>
                              ))}
                            </LocationsContainer>
                          ) : (
                            <NoLocationsMessage>
                              {isLoadingLocations ? 
                                'Loading drop locations...' : 
                                'Enter your pincode to see available drop-off centers.'}
                            </NoLocationsMessage>
                          )}
                          {errors.dropLocationId && <ErrorMessage>{errors.dropLocationId}</ErrorMessage>}
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
                      <ContinueButton 
                        type="button" 
                        onClick={() => {
                          const isValid = validateStep(2);
                          if (isValid) setCurrentStep(3);
                        }}
                      >
                        Continue
                      </ContinueButton>
                    </ButtonGroup>
                  </Form>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <InputGroup>
                      <Label>Food Items</Label>
                      {formData.foodItems.length > 0 ? (
                        formData.foodItems.map(item => (
                          <ItemCard key={item.id}>
                            <ItemName>{item.name}</ItemName>
                            <ItemQuantity>{item.quantity}</ItemQuantity>
                            <ItemUnit>{item.unit}</ItemUnit>
                            <DeleteButton onClick={() => removeFoodItem(item.id)}>
                              <FaTrash />
                            </DeleteButton>
                          </ItemCard>
                        ))
                      ) : (
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '30px', 
                          background: '#f9f9f9', 
                          borderRadius: '12px',
                          marginBottom: '20px'
                        }}>
                          <p style={{ color: '#666', marginBottom: '15px' }}>No food items added yet</p>
                          <p style={{ color: '#888', fontSize: '0.9rem' }}>Click the button below to add your first item</p>
                        </div>
                      )}
                      
                      <AddItemButton type="button" onClick={addFoodItem}>
                        <FaPlus size={16} /> Add Food Item
                      </AddItemButton>
                      
                      {errors.foodItems && <ErrorMessage>{errors.foodItems}</ErrorMessage>}
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
                    
                    <ButtonGroup>
                      <BackButton type="button" onClick={() => setCurrentStep(2)}>Back</BackButton>
                      <SubmitButton type="submit" isSubmitting={isSubmitting}>Submit</SubmitButton>
                    </ButtonGroup>
                    
                    {/* Food Item Modal */}
                    {showFoodItemModal && (
                      <Modal>
                        <ModalContent>
                          <ModalTitle>{editingFoodItemId ? 'Edit Food Item' : 'Add Food Item'}</ModalTitle>
                          
                          <InputGroup>
                            <Label>Food Item Name</Label>
                            <Input
                              type="text"
                              name="name"
                              value={newFoodItem.name}
                              onChange={handleFoodItemChange}
                              placeholder="e.g., Rice, Dal, Chapati"
                            />
                          </InputGroup>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <InputGroup>
                              <Label>Quantity</Label>
                              <Input
                                type="number"
                                name="quantity"
                                min="0"
                                value={newFoodItem.quantity}
                                onChange={handleFoodItemChange}
                                placeholder="Amount"
                              />
                            </InputGroup>
                            
                            <InputGroup>
                              <Label>Unit</Label>
                              <Select
                                name="unit"
                                value={newFoodItem.unit}
                                onChange={handleFoodItemChange}
                              >
                                <option value="units">Units</option>
                                <option value="kg">Kg</option>
                                <option value="liters">Liters</option>
                                <option value="packets">Packets</option>
                              </Select>
                            </InputGroup>
                          </div>
                          
                          <ModalButtons>
                            <CancelModalButton type="button" onClick={() => setShowFoodItemModal(false)}>
                              Cancel
                            </CancelModalButton>
                            <SaveModalButton type="button" onClick={saveFoodItem}>
                              Save
                            </SaveModalButton>
                          </ModalButtons>
                        </ModalContent>
                      </Modal>
                    )}
                  </Form>
                )}
              </>
            )}
          </FormSection>
        </Card>
      </Container>
    </PageWrapper>
  );
}

export default DonationForm;