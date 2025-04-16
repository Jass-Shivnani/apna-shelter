require('dotenv').config();
const mongoose = require('mongoose');
const DropLocation = require('../models/DropLocation');

// Sample drop locations data
const dropLocations = [
  {
    name: "Apna Shelter Main Center",
    address: "123 Charity Road, Mumbai",
    pincode: "400001",
    coordinates: [72.8777, 19.0760], // [longitude, latitude]
    timings: "9:00 AM - 6:00 PM",
    isActive: true
  },
  {
    name: "Apna Shelter North Branch",
    address: "45 Helping Street, Delhi",
    pincode: "110001",
    coordinates: [77.2090, 28.6139],
    timings: "8:00 AM - 5:00 PM",
    isActive: true
  },
  {
    name: "Apna Shelter East Center",
    address: "78 Community Avenue, Kolkata",
    pincode: "700001",
    coordinates: [88.3639, 22.5726],
    timings: "9:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "Apna Shelter South Hub",
    address: "22 Donation Lane, Chennai",
    pincode: "600001",
    coordinates: [80.2707, 13.0827],
    timings: "10:00 AM - 8:00 PM",
    isActive: true
  },
  {
    name: "Apna Shelter West Point",
    address: "56 Shelter Road, Ahmedabad",
    pincode: "380001",
    coordinates: [72.5714, 23.0225],
    timings: "8:30 AM - 6:30 PM",
    isActive: true
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apna-shelter')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clear existing drop locations
      await DropLocation.deleteMany({});
      console.log('Cleared existing drop locations');
      
      // Insert new drop locations
      const result = await DropLocation.insertMany(dropLocations);
      console.log(`Successfully seeded ${result.length} drop locations`);
      
      // Log the inserted locations
      console.log('Drop locations:');
      result.forEach(location => {
        console.log(`- ${location.name} (${location.pincode})`);
      });
    } catch (error) {
      console.error('Error seeding drop locations:', error);
    } finally {
      // Close the connection
      mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
