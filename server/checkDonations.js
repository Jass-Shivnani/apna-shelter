const mongoose = require('mongoose');
const Donation = require('./models/Donation');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apna-shelter')
  .then(async () => {
    try {
      console.log('Connected to MongoDB');
      
      // Get all donations
      const donations = await Donation.find();
      
      console.log(`Found ${donations.length} donations`);
      
      // Print donation IDs and names
      donations.forEach(donation => {
        console.log(`ID: ${donation._id}, Name: ${donation.name}`);
      });
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Close the connection
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
