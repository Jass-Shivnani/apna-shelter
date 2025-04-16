const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const User = require('../models/User');
const DropLocation = require('../models/DropLocation');
const VolunteerApplication = require('../models/VolunteerApplication');

// Get all volunteers
router.get('/', auth, async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: volunteers });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get volunteers for a specific drop location
router.get('/drop-location/:id', auth, async (req, res) => {
  try {
    const dropLocationId = req.params.id;
    
    // Find volunteers who are associated with this drop location
    const volunteers = await User.find({ 
      role: 'volunteer',
      dropLocationId: dropLocationId
    }).select('-password');
    
    res.json({ success: true, data: volunteers });
  } catch (error) {
    console.error('Error fetching volunteers for drop location:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update volunteer status (active/inactive)
router.post('/:id/status', auth, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }
    
    const volunteer = await User.findById(req.params.id);
    
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }
    
    if (volunteer.role !== 'volunteer') {
      return res.status(400).json({ success: false, message: 'User is not a volunteer' });
    }
    
    volunteer.isActive = isActive;
    await volunteer.save();
    
    res.json({ success: true, data: volunteer });
  } catch (error) {
    console.error('Error updating volunteer status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Submit a volunteer application
router.post('/apply', auth, async (req, res) => {
  try {
    const { dropLocationId, message } = req.body;
    const volunteerId = req.user.id;
    
    // Check if drop location exists
    const dropLocation = await DropLocation.findById(dropLocationId);
    if (!dropLocation) {
      return res.status(404).json({ success: false, message: 'Drop location not found' });
    }
    
    // Check if user exists
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if application already exists
    const existingApplication = await VolunteerApplication.findOne({
      volunteerId,
      dropLocationId,
      status: { $in: ['pending', 'approved'] }
    });
    
    if (existingApplication) {
      return res.status(400).json({ 
        success: false, 
        message: existingApplication.status === 'approved' 
          ? 'You are already a volunteer for this location' 
          : 'You already have a pending application for this location'
      });
    }
    
    // Create new application
    const application = new VolunteerApplication({
      volunteerId,
      dropLocationId,
      volunteerName: volunteer.username || 'Volunteer',
      email: volunteer.email || '',
      phone: volunteer.phone || '',
      city: volunteer.city || '',
      state: volunteer.state || '',
      message: message || `I would like to volunteer at ${dropLocation.name}`,
      status: 'pending'
    });
    
    await application.save();
    
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error('Error submitting volunteer application:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all applications
router.get('/applications', auth, async (req, res) => {
  try {
    // Only managers and admins can view all applications
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const applications = await VolunteerApplication.find()
      .populate('volunteerId', 'username email')
      .populate('dropLocationId', 'name city state')
      .sort({ appliedDate: -1 });
    
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get applications for a specific drop location
router.get('/applications/drop-location/:id', auth, async (req, res) => {
  try {
    const dropLocationId = req.params.id;
    
    // If user is a manager, they should only see applications for their drop location
    if (req.user.role === 'manager') {
      if (req.user.dropLocationId.toString() !== dropLocationId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }
    
    const applications = await VolunteerApplication.find({ 
      dropLocationId,
      status: 'pending'
    })
      .populate('volunteerId', 'username email phone city state')
      .sort({ appliedDate: -1 });
    
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching applications for drop location:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Process an application (approve/reject)
router.post('/applications/:id/:action', auth, async (req, res) => {
  try {
    const { id, action } = req.params;
    
    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }
    
    // Only managers and admins can process applications
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const application = await VolunteerApplication.findById(id);
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    // If user is a manager, they should only process applications for their drop location
    if (req.user.role === 'manager') {
      if (req.user.dropLocationId.toString() !== application.dropLocationId.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }
    
    // Update application status
    application.status = action === 'approve' ? 'approved' : 'rejected';
    application.processedDate = Date.now();
    application.processedBy = req.user.id;
    
    await application.save();
    
    // If approved, update the volunteer's dropLocationId
    if (action === 'approve') {
      await User.findByIdAndUpdate(application.volunteerId, {
        dropLocationId: application.dropLocationId,
        isActive: true
      });
    }
    
    res.json({ success: true, data: application });
  } catch (error) {
    console.error(`Error ${req.params.action}ing application:`, error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
