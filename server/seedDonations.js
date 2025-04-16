const mongoose = require('mongoose');
const Donation = require('./models/Donation');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apna-shelter')
  .then(async () => {
    try {
      console.log('Connected to MongoDB');
      
      // Clear existing donations
      await Donation.deleteMany({});
      console.log('Cleared existing donations');
      
      // Create sample donations with different names and details
      const donations = [
        {
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          phone: '9876543210',
          donationType: 'pickup',
          address: '123 Main Street',
          landmark: 'Near City Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001',
          coordinates: { lat: 19.0760, lng: 72.8777 },
          foodItems: [
            { name: 'Rice', quantity: 5, unit: 'kg' },
            { name: 'Dal', quantity: 2, unit: 'kg' }
          ],
          status: 'pending',
          notes: 'Please pickup in the evening'
        },
        {
          name: 'Priya Patel',
          email: 'priya@example.com',
          phone: '8765432109',
          donationType: 'drop-off',
          pinCode: '400002',
          dropLocationId: '60d5ec9c1c9d440000d1a1f1', // This will be replaced
          foodItems: [
            { name: 'Wheat Flour', quantity: 10, unit: 'kg' },
            { name: 'Sugar', quantity: 2, unit: 'kg' }
          ],
          status: 'confirmed',
          notes: 'Will drop off tomorrow morning'
        },
        {
          name: 'Amit Kumar',
          email: 'amit@example.com',
          phone: '7654321098',
          donationType: 'pickup',
          address: '456 Park Avenue',
          landmark: 'Opposite Railway Station',
          city: 'Delhi',
          state: 'Delhi',
          pinCode: '110001',
          coordinates: { lat: 28.6139, lng: 77.2090 },
          foodItems: [
            { name: 'Cooking Oil', quantity: 5, unit: 'liters' },
            { name: 'Spices', quantity: 10, unit: 'packets' }
          ],
          status: 'completed',
          notes: 'Thank you for the service'
        },
        {
          name: 'Sneha Gupta',
          email: 'sneha@example.com',
          phone: '6543210987',
          donationType: 'drop-off',
          pinCode: '700001',
          dropLocationId: '60d5ec9c1c9d440000d1a1f3', // This will be replaced
          foodItems: [
            { name: 'Biscuits', quantity: 20, unit: 'packets' },
            { name: 'Milk Powder', quantity: 5, unit: 'kg' }
          ],
          status: 'cancelled',
          notes: 'Had to cancel due to emergency'
        }
      ];
      
      // Insert donations
      const result = await Donation.insertMany(donations);
      console.log(`Inserted ${result.length} donations`);
      
      // Print inserted donations
      const insertedDonations = await Donation.find();
      insertedDonations.forEach(donation => {
        console.log(`ID: ${donation._id}, Name: ${donation.name}, Status: ${donation.status}`);
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
