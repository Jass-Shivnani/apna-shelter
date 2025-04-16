const axios = require('axios');

// Google Maps API key - should be stored in environment variables
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Reverse geocode a location based on coordinates
 * @param {Number} lat - Latitude
 * @param {Number} lng - Longitude
 * @returns {Object} Address details
 */
const reverseGeocode = async (lat, lng) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);
    
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      const addressComponents = result.address_components;
      
      // Extract address components
      const streetNumber = getAddressComponent(addressComponents, 'street_number', 'short_name') || '';
      const route = getAddressComponent(addressComponents, 'route', 'long_name') || '';
      const sublocality = getAddressComponent(addressComponents, 'sublocality', 'long_name') || 
                         getAddressComponent(addressComponents, 'sublocality_level_1', 'long_name') || '';
      const locality = getAddressComponent(addressComponents, 'locality', 'long_name') || '';
      const district = getAddressComponent(addressComponents, 'administrative_area_level_2', 'long_name') || '';
      const state = getAddressComponent(addressComponents, 'administrative_area_level_1', 'long_name') || '';
      const country = getAddressComponent(addressComponents, 'country', 'long_name') || '';
      const postalCode = getAddressComponent(addressComponents, 'postal_code', 'short_name') || '';
      
      // Determine the most appropriate city name (prioritize more specific locations)
      let city = '';
      if (locality) {
        city = locality;    // City/town
      } else if (sublocality) {
        city = sublocality; // Most specific
      } else if (district) {
        city = district;    // District/county
      }
      
      // Get a more accurate address string - avoid placeholder values
      let addressString = '';
      
      // First try to get the first part of formatted address
      if (result.formatted_address) {
        // Extract the first part of the formatted address (typically the street address)
        const formattedParts = result.formatted_address.split(',');
        if (formattedParts[0] && !formattedParts[0].includes('Unnamed') && !formattedParts[0].includes('123 Sample')) {
          addressString = formattedParts[0];
        }
      }
      
      // If no good formatted address, try to build from components
      if (!addressString && (streetNumber || route)) {
        addressString = `${streetNumber} ${route}`.trim();
      }
      
      // If still no address, use the sublocality or neighborhood if available
      if (!addressString) {
        const neighborhood = getAddressComponent(addressComponents, 'neighborhood', 'long_name') || '';
        if (sublocality) {
          addressString = sublocality;
        } else if (neighborhood) {
          addressString = neighborhood;
        }
      }
      
      // If still no address, use the locality
      if (!addressString && locality) {
        addressString = locality;
      }
      
      // If there's no specific address but we have a formatted address, use the full formatted address
      if (!addressString && result.formatted_address) {
        // Remove the postal code, city, state, and country from the formatted address
        let fullAddress = result.formatted_address;
        if (postalCode) fullAddress = fullAddress.replace(postalCode, '');
        if (city) fullAddress = fullAddress.replace(city, '');
        if (state) fullAddress = fullAddress.replace(state, '');
        if (country) fullAddress = fullAddress.replace(country, '');
        
        // Clean up any remaining commas and spaces
        addressString = fullAddress.replace(/,\s*,/g, ',').replace(/^\s*,\s*|\s*,\s*$/g, '').trim();
        
        // If we've removed too much, just use the first part of the formatted address
        if (!addressString && formattedParts && formattedParts.length > 0) {
          addressString = formattedParts[0];
        }
      }
      
      // Ensure we have a postal code
      let zipcode = postalCode;
      if (!zipcode) {
        // Try to extract postal code from formatted address if not found in components
        const postalCodeMatch = result.formatted_address.match(/\b\d{6}\b/); // Indian postal codes are 6 digits
        if (postalCodeMatch) {
          zipcode = postalCodeMatch[0];
        } else {
          // Default to a nearby postal code based on city
          if (city === 'Mumbai') zipcode = '400001';
          else if (city === 'Delhi') zipcode = '110001';
          else if (city === 'Bangalore') zipcode = '560001';
          else if (city === 'Chennai') zipcode = '600001';
          else if (city === 'Kolkata') zipcode = '700001';
          else zipcode = '';
        }
      }
      
      console.log('Geocoding result:', {
        address: addressString,
        city: city,
        state: state,
        country: country,
        zipcode: zipcode,
        latitude: lat,
        longitude: lng,
        full_result: result
      });
      
      return {
        address: addressString,
        city: city,
        state: state,
        country: country,
        zipcode: zipcode,
        latitude: lat,
        longitude: lng
      };
    }
    
    throw new Error('No results found');
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
};

/**
 * Forward geocode an address to get coordinates
 * @param {String} address - Full address or pincode
 * @returns {Object} Coordinates and address details
 */
const forwardGeocode = async (address) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);
    
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      const addressComponents = result.address_components;
      
      // Extract address components
      const locality = getAddressComponent(addressComponents, 'locality', 'long_name') || '';
      const city = getAddressComponent(addressComponents, 'administrative_area_level_2', 'long_name') || locality;
      const state = getAddressComponent(addressComponents, 'administrative_area_level_1', 'long_name') || '';
      const country = getAddressComponent(addressComponents, 'country', 'long_name') || '';
      const postalCode = getAddressComponent(addressComponents, 'postal_code', 'short_name') || '';
      
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        city: city,
        state: state,
        country: country,
        zipcode: postalCode
      };
    }
    
    throw new Error('No results found');
  } catch (error) {
    console.error('Forward geocoding error:', error);
    throw error;
  }
};

/**
 * Find nearby drop locations based on pincode
 * @param {String} pincode - Pincode to search near
 * @param {Number} radius - Search radius in kilometers
 * @returns {Array} Array of coordinates for nearby drop locations
 */
const findNearbyByPincode = async (pincode, radius = 5) => {
  try {
    // First get coordinates for the pincode
    const location = await forwardGeocode(pincode);
    
    if (!location) {
      throw new Error('Invalid pincode');
    }
    
    return {
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      address: location.formattedAddress,
      city: location.city,
      state: location.state
    };
  } catch (error) {
    console.error('Error finding nearby locations by pincode:', error);
    throw error;
  }
};

/**
 * Helper function to extract address components from Google Maps API response
 * @param {Array} components - Address components from Google Maps API
 * @param {String} type - Type of component to extract
 * @param {String} nameType - Name type (short_name or long_name)
 * @returns {String} Extracted component or empty string
 */
const getAddressComponent = (components, type, nameType) => {
  const component = components.find(comp => comp.types.includes(type));
  return component ? component[nameType] : '';
};

module.exports = {
  reverseGeocode,
  forwardGeocode,
  findNearbyByPincode
};
