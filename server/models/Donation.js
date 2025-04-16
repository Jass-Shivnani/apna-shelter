const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    required: true,
    enum: ['units', 'kg', 'liters', 'packets'],
    default: 'units'
  }
}, { _id: true });

const DonationSchema = new mongoose.Schema({
  // Personal information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  // Donation details
  donationType: {
    type: String,
    required: true,
    enum: ['pickup', 'drop-off']
  },
  foodItems: {
    type: [FoodItemSchema],
    required: true,
    validate: [
      {
        validator: function(items) {
          return items && items.length > 0;
        },
        message: 'At least one food item is required'
      }
    ]
  },
  notes: {
    type: String,
    trim: true
  },
  
  // For pickup donations only
  address: {
    type: String,
    required: function() { return this.donationType === 'pickup'; },
    trim: true
  },
  landmark: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: function() { return this.donationType === 'pickup'; },
    trim: true
  },
  state: {
    type: String,
    required: function() { return this.donationType === 'pickup'; },
    trim: true
  },
  pinCode: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    type: {
      lat: Number,
      lng: Number
    },
    required: function() { return this.donationType === 'pickup'; }
  },
  
  // For drop-off donations only
  dropLocationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DropLocation',
    required: function() { return this.donationType === 'drop-off'; }
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
DonationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Donation', DonationSchema);
