const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const DropLocation = require('../models/DropLocation');
const { validateDonationData } = require('../middleware/validation');

/**
 * @route   POST /api/donations
 * @desc    Create a new donation
 * @access  Public
 */
router.post('/', validateDonationData, async (req, res) => {
  try {
    const donationData = req.body;
    
    // Ensure foodItems are properly formatted
    if (donationData.foodItems && Array.isArray(donationData.foodItems)) {
      donationData.foodItems = donationData.foodItems.map(item => ({
        name: item.name,
        quantity: Number(item.quantity),
        unit: item.unit || 'units'
      }));
    }
    
    // Create new donation
    const donation = new Donation(donationData);
    await donation.save();
    
    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: donation
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating donation',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/donations
 * @desc    Get all donations
 * @access  Private (should be protected in production)
 */
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    console.error('Error getting donations:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving donations',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/donations/:id
 * @desc    Get donation by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }
    
    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error('Error getting donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving donation',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/donations/:id
 * @desc    Update donation status
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Donation status updated',
      data: donation
    });
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating donation',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/donations/drop-locations
 * @desc    Get all drop locations
 * @access  Public
 */
router.get('/drop-locations/all', async (req, res) => {
  try {
    const locations = await DropLocation.find({ isActive: true });
    
    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error('Error getting drop locations:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving drop locations',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/donations/drop-locations/nearby
 * @desc    Find nearby drop locations by pincode
 * @access  Public
 */
router.get('/drop-locations/nearby', async (req, res) => {
  try {
    const { pincode } = req.query;
    
    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: 'Pincode is required'
      });
    }
    
    // Find locations with exact pincode match or nearby pincodes
    // For nearby locations, we're looking at the first 3 digits of the pincode
    const pincodePrefix = pincode.substring(0, 3);
    
    const locations = await DropLocation.find({
      $and: [
        { isActive: true },
        { 
          $or: [
            { pincode: pincode },
            { pincode: { $regex: `^${pincodePrefix}` } }
          ]
        }
      ]
    });
    
    // Sort locations by proximity to the given pincode
    // Exact matches first, then by how close the pincode is
    const sortedLocations = locations.sort((a, b) => {
      // Exact matches come first
      if (a.pincode === pincode && b.pincode !== pincode) return -1;
      if (a.pincode !== pincode && b.pincode === pincode) return 1;
      
      // Then sort by how many digits match from the beginning
      const aMatchLength = getCommonPrefixLength(a.pincode, pincode);
      const bMatchLength = getCommonPrefixLength(b.pincode, pincode);
      
      if (aMatchLength !== bMatchLength) {
        return bMatchLength - aMatchLength; // More matching digits come first
      }
      
      // If match length is the same, sort by name
      return a.name.localeCompare(b.name);
    });
    
    res.json({
      success: true,
      count: sortedLocations.length,
      data: sortedLocations
    });
  } catch (error) {
    console.error('Error finding nearby drop locations:', error);
    res.status(500).json({
      success: false,
      message: 'Error finding nearby drop locations',
      error: error.message
    });
  }
});

/**
 * Helper function to get the length of the common prefix between two strings
 */
function getCommonPrefixLength(str1, str2) {
  let i = 0;
  while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
    i++;
  }
  return i;
}

module.exports = router;
