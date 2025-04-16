const express = require('express');
const router = express.Router();
const geocodeService = require('../services/geocodeService');

/**
 * @route   GET /api/geocode/reverse
 * @desc    Reverse geocode coordinates to address
 * @access  Public
 */
router.get('/reverse', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }
    
    const result = await geocodeService.reverseGeocode(lat, lng);
    
    res.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('Reverse geocode error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error performing reverse geocoding',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/geocode/forward
 * @desc    Forward geocode address to coordinates
 * @access  Public
 */
router.get('/forward', async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Address is required' 
      });
    }
    
    const result = await geocodeService.forwardGeocode(address);
    
    res.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('Forward geocode error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error performing forward geocoding',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/geocode/nearby
 * @desc    Find nearby locations by pincode
 * @access  Public
 */
router.get('/nearby', async (req, res) => {
  try {
    const { pincode, radius } = req.query;
    
    if (!pincode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Pincode is required' 
      });
    }
    
    const result = await geocodeService.findNearbyByPincode(pincode, radius || 5);
    
    res.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('Find nearby error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error finding nearby locations',
      error: error.message
    });
  }
});

module.exports = router;
