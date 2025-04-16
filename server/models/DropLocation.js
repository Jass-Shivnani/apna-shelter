const mongoose = require('mongoose');
const geocodeService = require('../services/geocodeService');

const DropLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
    index: '2dsphere' // Create a geospatial index for location-based queries
  },
  timings: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Method to find nearby drop locations based on pincode
DropLocationSchema.statics.findNearbyLocations = async function(pincode, maxDistance = 10000) {
  try {
    // First try to find locations with matching pincode
    const exactMatches = await this.find({ pincode: pincode, isActive: true });
    
    if (exactMatches.length > 0) {
      return exactMatches;
    }
    
    // If no exact matches, use geocoding service to get coordinates for the pincode
    try {
      const locationData = await geocodeService.findNearbyByPincode(pincode);
      
      if (locationData && locationData.coordinates) {
        // Use the coordinates to find nearby locations
        const nearbyLocations = await this.find({
          isActive: true,
          coordinates: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [locationData.coordinates.longitude, locationData.coordinates.latitude]
              },
              $maxDistance: maxDistance
            }
          }
        }).limit(10);
        
        return nearbyLocations;
      }
    } catch (geocodeError) {
      console.error('Geocoding error:', geocodeError);
    }
    
    // Return empty array if no locations found or geocoding failed
    return [];
  } catch (error) {
    console.error('Error finding nearby locations:', error);
    throw error;
  }
};

module.exports = mongoose.model('DropLocation', DropLocationSchema);
