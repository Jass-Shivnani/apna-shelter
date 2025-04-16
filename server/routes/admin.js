const express = require('express');
const router = express.Router();
const DropLocation = require('../models/DropLocation');
const { validateDropLocationData } = require('../middleware/validation');

/**
 * @route   GET /api/admin/drop-locations
 * @desc    Get all drop locations (including inactive)
 * @access  Admin
 */
router.get('/drop-locations', async (req, res) => {
  try {
    const locations = await DropLocation.find().sort({ name: 1 });
    
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
 * @route   POST /api/admin/drop-locations
 * @desc    Create a new drop location
 * @access  Admin
 */
router.post('/drop-locations', validateDropLocationData, async (req, res) => {
  try {
    const locationData = req.body;
    
    // Create new drop location
    const location = new DropLocation(locationData);
    await location.save();
    
    res.status(201).json({
      success: true,
      message: 'Drop location created successfully',
      data: location
    });
  } catch (error) {
    console.error('Error creating drop location:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating drop location',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin/drop-locations/:id
 * @desc    Get drop location by ID
 * @access  Admin
 */
router.get('/drop-locations/:id', async (req, res) => {
  try {
    const location = await DropLocation.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Drop location not found'
      });
    }
    
    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Error getting drop location:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving drop location',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin/drop-locations/:id
 * @desc    Update drop location
 * @access  Admin
 */
router.put('/drop-locations/:id', validateDropLocationData, async (req, res) => {
  try {
    const locationData = req.body;
    
    const location = await DropLocation.findByIdAndUpdate(
      req.params.id,
      locationData,
      { new: true, runValidators: true }
    );
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Drop location not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Drop location updated successfully',
      data: location
    });
  } catch (error) {
    console.error('Error updating drop location:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating drop location',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/admin/drop-locations/:id
 * @desc    Delete drop location
 * @access  Admin
 */
router.delete('/drop-locations/:id', async (req, res) => {
  try {
    const location = await DropLocation.findByIdAndDelete(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Drop location not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Drop location deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting drop location:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting drop location',
      error: error.message
    });
  }
});

/**
 * @route   PATCH /api/admin/drop-locations/:id/toggle-status
 * @desc    Toggle drop location active status
 * @access  Admin
 */
router.patch('/drop-locations/:id/toggle-status', async (req, res) => {
  try {
    const location = await DropLocation.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Drop location not found'
      });
    }
    
    location.isActive = !location.isActive;
    await location.save();
    
    res.json({
      success: true,
      message: `Drop location ${location.isActive ? 'activated' : 'deactivated'} successfully`,
      data: location
    });
  } catch (error) {
    console.error('Error toggling drop location status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling drop location status',
      error: error.message
    });
  }
});

module.exports = router;
