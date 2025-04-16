const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const DropLocation = require('./models/DropLocation');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apna-shelter')
  .then(async () => {
    try {
      console.log('Connected to MongoDB');
      
      // Clear existing users
      await User.deleteMany({});
      console.log('Cleared existing users');
      
      // Create admin and volunteer users
      const baseUsers = [
        {
          username: 'admin',
          email: 'admin@apnashelter.org',
          password: await bcrypt.hash('admin123', 10),
          role: 'admin'
        },
        {
          username: 'volunteer',
          email: 'volunteer@apnashelter.org',
          password: await bcrypt.hash('volunteer123', 10),
          role: 'volunteer'
        }
      ];
      
      // Get all drop locations from the database
      const dropLocations = await DropLocation.find({});
      console.log(`Found ${dropLocations.length} drop locations`);
      
      // Create manager accounts for each drop location
      const managerUsers = await Promise.all(dropLocations.map(async (location, index) => {
        // Create a unique username based on location name and index
        const locationName = location.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const username = `manager_${locationName.substring(0, 10)}_${index}`;
        
        return {
          username,
          email: `${username}@apnashelter.org`,
          password: await bcrypt.hash('manager123', 10),
          role: 'manager',
          associatedNgo: {
            id: location._id.toString(),
            name: location.name,
            address: location.address,
            pincode: location.pincode
          }
        };
      }));
      
      // Combine all users
      const allUsers = [...baseUsers, ...managerUsers];
      
      // Insert users
      const result = await User.insertMany(allUsers);
      console.log(`Inserted ${result.length} users`);
      console.log(`- Admin users: 1`);
      console.log(`- Manager users: ${managerUsers.length}`);
      console.log(`- Volunteer users: 1`);
      
      // Print inserted users
      console.log("\nAdmin and Volunteer Users:");
      baseUsers.forEach(user => {
        const insertedUser = result.find(u => u.username === user.username);
        console.log(`Username: ${user.username}, Role: ${user.role}, ID: ${insertedUser._id}`);
      });
      
      console.log("\nSample Manager Users (showing first 5):");
      result.filter(user => user.role === 'manager').slice(0, 5).forEach(user => {
        console.log(`Username: ${user.username}, Role: ${user.role}, ID: ${user._id}`);
        console.log(`  Associated NGO: ${user.associatedNgo.name}`);
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
