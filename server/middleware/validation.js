/**
 * Middleware for validating donation form data
 */

// Validate donation form data
const validateDonationData = (req, res, next) => {
  const { 
    name, email, phone, donationType, foodItems, pinCode,
    address, city, state, coordinates,
    dropLocationId
  } = req.body;
  
  const errors = {};
  
  // Basic validation for required fields
  if (!name) errors.name = 'Name is required';
  if (!email) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email format';
  
  if (!phone) errors.phone = 'Phone number is required';
  else if (!/^\d{10}$/.test(phone)) errors.phone = 'Phone must be 10 digits';
  
  if (!donationType) errors.donationType = 'Donation type is required';
  if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
    errors.foodItems = 'At least one food item is required';
  } else {
    // Validate each food item
    const invalidItems = foodItems.filter(item => 
      !item.name || 
      !item.quantity || 
      isNaN(Number(item.quantity)) || 
      Number(item.quantity) <= 0 ||
      !item.unit
    );
    
    if (invalidItems.length > 0) {
      errors.foodItems = 'Some food items have invalid or missing data';
    }
  }
  
  // Validation for pickup donations
  if (donationType === 'pickup') {
    if (!address) errors.address = 'Address is required for pickup donations';
    if (!city) errors.city = 'City is required for pickup donations';
    if (!state) errors.state = 'State is required for pickup donations';
    if (!pinCode) errors.pinCode = 'Pin code is required for pickup donations';
    else if (!/^\d{6}$/.test(pinCode)) errors.pinCode = 'Pin code must be 6 digits';
    
    if (!coordinates) errors.coordinates = 'Location coordinates are required';
    else if (!coordinates.lat || !coordinates.lng) {
      errors.coordinates = 'Invalid coordinates format';
    }
  }
  
  // Validation for drop-off donations
  if (donationType === 'drop-off') {
    if (!pinCode) errors.pinCode = 'Pin code is required for drop-off donations';
    else if (!/^\d{6}$/.test(pinCode)) errors.pinCode = 'Pin code must be 6 digits';
    
    if (!dropLocationId) {
      errors.dropLocationId = 'Please select a drop location';
    }
  }
  
  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  // If validation passes, proceed to the next middleware
  next();
};

/**
 * Middleware for validating drop location data
 */
const validateDropLocationData = (req, res, next) => {
  const { name, address, pincode, coordinates, timings } = req.body;
  
  const errors = {};
  
  // Validate required fields
  if (!name) errors.name = 'Location name is required';
  if (!address) errors.address = 'Address is required';
  if (!pincode) errors.pincode = 'PIN code is required';
  else if (!/^\d{6}$/.test(pincode)) errors.pincode = 'PIN code must be 6 digits';
  
  if (!timings) errors.timings = 'Operating hours are required';
  
  // Validate coordinates
  if (!coordinates) errors.coordinates = 'Coordinates are required';
  else if (!Array.isArray(coordinates) || coordinates.length !== 2 || 
           typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') {
    errors.coordinates = 'Coordinates must be an array of two numbers [longitude, latitude]';
  }
  
  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  // If validation passes, proceed to the next middleware
  next();
};

module.exports = {
  validateDonationData,
  validateDropLocationData
};
