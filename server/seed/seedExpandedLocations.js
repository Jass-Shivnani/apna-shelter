require('dotenv').config();
const mongoose = require('mongoose');
const DropLocation = require('../models/DropLocation');

// Mumbai area drop locations
const mumbaiLocations = [
  {
    name: "Akshaya Patra Foundation",
    address: "Hare Krishna Land, Juhu, Mumbai",
    pincode: "400049",
    coordinates: [72.8296, 19.1075],
    timings: "9:00 AM - 6:00 PM",
    isActive: true
  },
  {
    name: "Feeding India - Mumbai Chapter",
    address: "Andheri East, Mumbai",
    pincode: "400069",
    coordinates: [72.8691, 19.1136],
    timings: "8:00 AM - 8:00 PM",
    isActive: true
  },
  {
    name: "Robin Hood Army - Bandra",
    address: "Linking Road, Bandra West, Mumbai",
    pincode: "400050",
    coordinates: [72.8296, 19.0596],
    timings: "10:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "Roti Bank Foundation",
    address: "Mahim West, Mumbai",
    pincode: "400016",
    coordinates: [72.8421, 19.0368],
    timings: "7:00 AM - 9:00 PM",
    isActive: true
  },
  {
    name: "Annakshetra - Dadar",
    address: "Dadar West, Mumbai",
    pincode: "400028",
    coordinates: [72.8296, 19.0178],
    timings: "8:00 AM - 6:00 PM",
    isActive: true
  },
  {
    name: "Food Matters India",
    address: "Worli, Mumbai",
    pincode: "400018",
    coordinates: [72.8179, 18.9986],
    timings: "9:00 AM - 5:00 PM",
    isActive: true
  },
  {
    name: "Feeding Mumbai",
    address: "Colaba, Mumbai",
    pincode: "400005",
    coordinates: [72.8308, 18.9067],
    timings: "8:30 AM - 7:30 PM",
    isActive: true
  },
  {
    name: "Bhaktivedanta Hospital Food Relief",
    address: "Mira Road East, Mumbai",
    pincode: "401107",
    coordinates: [72.8691, 19.2813],
    timings: "24 Hours",
    isActive: true
  },
  {
    name: "Annamrita Foundation",
    address: "Chembur, Mumbai",
    pincode: "400071",
    coordinates: [72.8994, 19.0543],
    timings: "7:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "ISKCON Food Relief Foundation",
    address: "Juhu, Mumbai",
    pincode: "400049",
    coordinates: [72.8266, 19.1031],
    timings: "8:00 AM - 8:00 PM",
    isActive: true
  },
  {
    name: "Seva Kitchen",
    address: "Santacruz West, Mumbai",
    pincode: "400054",
    coordinates: [72.8421, 19.0850],
    timings: "9:00 AM - 6:00 PM",
    isActive: true
  },
  {
    name: "Khaana Chahiye Foundation",
    address: "Kurla West, Mumbai",
    pincode: "400070",
    coordinates: [72.8877, 19.0726],
    timings: "10:00 AM - 8:00 PM",
    isActive: true
  },
  {
    name: "Mumbai Roti Bank",
    address: "Mahim East, Mumbai",
    pincode: "400016",
    coordinates: [72.8457, 19.0368],
    timings: "24 Hours",
    isActive: true
  },
  {
    name: "Harmony Foundation Food Bank",
    address: "Sion, Mumbai",
    pincode: "400022",
    coordinates: [72.8691, 19.0368],
    timings: "9:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "Feeding Hands Mumbai",
    address: "Goregaon East, Mumbai",
    pincode: "400063",
    coordinates: [72.8691, 19.1662],
    timings: "8:00 AM - 6:00 PM",
    isActive: true
  },
  {
    name: "Share A Meal Foundation",
    address: "Malad West, Mumbai",
    pincode: "400064",
    coordinates: [72.8421, 19.1871],
    timings: "10:00 AM - 8:00 PM",
    isActive: true
  },
  {
    name: "Food Warriors India",
    address: "Kandivali East, Mumbai",
    pincode: "400101",
    coordinates: [72.8691, 19.2029],
    timings: "9:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "Apna Ghar Ashram",
    address: "Borivali West, Mumbai",
    pincode: "400092",
    coordinates: [72.8457, 19.2339],
    timings: "8:00 AM - 8:00 PM",
    isActive: true
  },
  {
    name: "Manav Seva Sangh",
    address: "Sion, Mumbai",
    pincode: "400022",
    coordinates: [72.8691, 19.0409],
    timings: "9:00 AM - 6:00 PM",
    isActive: true
  },
  {
    name: "Shree Sanatan Dharam Pratinidhi Sabha",
    address: "Khar West, Mumbai",
    pincode: "400052",
    coordinates: [72.8296, 19.0702],
    timings: "10:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "Jain Social Group Mumbai",
    address: "Ghatkopar East, Mumbai",
    pincode: "400077",
    coordinates: [72.9081, 19.0790],
    timings: "8:00 AM - 6:00 PM",
    isActive: true
  },
  {
    name: "Sadhu Vaswani Mission",
    address: "Chembur, Mumbai",
    pincode: "400071",
    coordinates: [72.8994, 19.0596],
    timings: "7:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "Guru Singh Sabha",
    address: "Dadar East, Mumbai",
    pincode: "400014",
    coordinates: [72.8457, 19.0178],
    timings: "6:00 AM - 9:00 PM",
    isActive: true
  },
  {
    name: "Dignity Foundation",
    address: "Bandra East, Mumbai",
    pincode: "400051",
    coordinates: [72.8457, 19.0596],
    timings: "9:00 AM - 5:00 PM",
    isActive: true
  },
  {
    name: "Bombay Catholic Sabha",
    address: "Mahim West, Mumbai",
    pincode: "400016",
    coordinates: [72.8421, 19.0326],
    timings: "8:00 AM - 8:00 PM",
    isActive: true
  }
];

// Thane area drop locations
const thaneLocations = [
  {
    name: "Thane Food Bank",
    address: "Naupada, Thane West",
    pincode: "400602",
    coordinates: [72.9695, 19.1982],
    timings: "9:00 AM - 6:00 PM",
    isActive: true
  },
  {
    name: "Rotary Club of Thane",
    address: "Thane West",
    pincode: "400601",
    coordinates: [72.9695, 19.2029],
    timings: "10:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "Lions Club Thane",
    address: "Wagle Estate, Thane",
    pincode: "400604",
    coordinates: [72.9695, 19.2076],
    timings: "8:00 AM - 8:00 PM",
    isActive: true
  },
  {
    name: "Thane Seva Sansthan",
    address: "Kopri, Thane East",
    pincode: "400603",
    coordinates: [72.9812, 19.1982],
    timings: "9:00 AM - 5:00 PM",
    isActive: true
  },
  {
    name: "Jeevan Jyot Foundation",
    address: "Majiwada, Thane",
    pincode: "400601",
    coordinates: [72.9695, 19.2123],
    timings: "8:30 AM - 6:30 PM",
    isActive: true
  },
  {
    name: "Thane Roti Bank",
    address: "Naupada, Thane West",
    pincode: "400602",
    coordinates: [72.9695, 19.1935],
    timings: "24 Hours",
    isActive: true
  },
  {
    name: "Thane Bharat Seva Sangh",
    address: "Kalwa, Thane",
    pincode: "400605",
    coordinates: [72.9929, 19.1935],
    timings: "9:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "Annamrita Foundation Thane",
    address: "Wagle Estate, Thane",
    pincode: "400604",
    coordinates: [72.9695, 19.2123],
    timings: "7:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "Thane Municipal Corporation Food Bank",
    address: "Panchpakhadi, Thane",
    pincode: "400602",
    coordinates: [72.9695, 19.2029],
    timings: "9:00 AM - 5:00 PM",
    isActive: true
  },
  {
    name: "Samarpan Foundation Thane",
    address: "Hiranandani Estate, Thane",
    pincode: "400607",
    coordinates: [72.9812, 19.2339],
    timings: "10:00 AM - 8:00 PM",
    isActive: true
  },
  {
    name: "Thane Seva Sadan",
    address: "Naupada, Thane West",
    pincode: "400602",
    coordinates: [72.9695, 19.1982],
    timings: "8:00 AM - 6:00 PM",
    isActive: true
  },
  {
    name: "Thane Welfare Association",
    address: "Ghodbunder Road, Thane",
    pincode: "400615",
    coordinates: [72.9461, 19.2339],
    timings: "9:00 AM - 7:00 PM",
    isActive: true
  }
];

// Ulhasnagar area drop locations
const ulhasnagarLocations = [
  {
    name: "Ulhasnagar Sindhi Sabha",
    address: "Sector 17, Ulhasnagar",
    pincode: "421003",
    coordinates: [73.1641, 19.2182],
    timings: "9:00 AM - 6:00 PM",
    isActive: true
  },
  {
    name: "Ulhasnagar Seva Mandal",
    address: "Sector 5, Ulhasnagar",
    pincode: "421004",
    coordinates: [73.1641, 19.2229],
    timings: "8:00 AM - 8:00 PM",
    isActive: true
  },
  {
    name: "Ulhasnagar Food Relief",
    address: "Sector 3, Ulhasnagar",
    pincode: "421003",
    coordinates: [73.1641, 19.2276],
    timings: "10:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "Sindhu Seva Samiti",
    address: "Sector 4, Ulhasnagar",
    pincode: "421004",
    coordinates: [73.1641, 19.2323],
    timings: "9:00 AM - 5:00 PM",
    isActive: true
  },
  {
    name: "Ulhasnagar Roti Bank",
    address: "Sector 2, Ulhasnagar",
    pincode: "421002",
    coordinates: [73.1524, 19.2182],
    timings: "24 Hours",
    isActive: true
  },
  {
    name: "Ulhasnagar Welfare Association",
    address: "Sector 1, Ulhasnagar",
    pincode: "421001",
    coordinates: [73.1524, 19.2229],
    timings: "8:30 AM - 6:30 PM",
    isActive: true
  },
  {
    name: "Ulhasnagar Municipal Corporation Food Bank",
    address: "Sector 5, Ulhasnagar",
    pincode: "421004",
    coordinates: [73.1641, 19.2229],
    timings: "9:00 AM - 5:00 PM",
    isActive: true
  },
  {
    name: "Ulhasnagar Sindhi Panchayat",
    address: "Sector 4, Ulhasnagar",
    pincode: "421004",
    coordinates: [73.1641, 19.2323],
    timings: "10:00 AM - 8:00 PM",
    isActive: true
  }
];

// Kalyan area drop locations
const kalyanLocations = [
  {
    name: "Kalyan Seva Sangh",
    address: "Kalyan West",
    pincode: "421301",
    coordinates: [73.1290, 19.2339],
    timings: "9:00 AM - 6:00 PM",
    isActive: true
  },
  {
    name: "Kalyan Food Bank",
    address: "Kalyan East",
    pincode: "421306",
    coordinates: [73.1407, 19.2339],
    timings: "8:00 AM - 8:00 PM",
    isActive: true
  },
  {
    name: "Rotary Club of Kalyan",
    address: "Kalyan West",
    pincode: "421301",
    coordinates: [73.1290, 19.2386],
    timings: "10:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "Lions Club Kalyan",
    address: "Kalyan East",
    pincode: "421306",
    coordinates: [73.1407, 19.2386],
    timings: "9:00 AM - 5:00 PM",
    isActive: true
  },
  {
    name: "Kalyan Roti Bank",
    address: "Kalyan West",
    pincode: "421301",
    coordinates: [73.1290, 19.2433],
    timings: "24 Hours",
    isActive: true
  },
  {
    name: "Kalyan Welfare Association",
    address: "Kalyan East",
    pincode: "421306",
    coordinates: [73.1407, 19.2433],
    timings: "8:30 AM - 6:30 PM",
    isActive: true
  },
  {
    name: "Kalyan Municipal Corporation Food Bank",
    address: "Kalyan West",
    pincode: "421301",
    coordinates: [73.1290, 19.2480],
    timings: "9:00 AM - 5:00 PM",
    isActive: true
  },
  {
    name: "Kalyan Seva Sadan",
    address: "Kalyan East",
    pincode: "421306",
    coordinates: [73.1407, 19.2480],
    timings: "10:00 AM - 8:00 PM",
    isActive: true
  }
];

// Navi Mumbai area drop locations
const naviMumbaiLocations = [
  {
    name: "Navi Mumbai Food Bank",
    address: "Vashi, Navi Mumbai",
    pincode: "400703",
    coordinates: [73.0080, 19.0756],
    timings: "9:00 AM - 6:00 PM",
    isActive: true
  },
  {
    name: "Rotary Club of Navi Mumbai",
    address: "Nerul, Navi Mumbai",
    pincode: "400706",
    coordinates: [73.0197, 19.0368],
    timings: "10:00 AM - 7:00 PM",
    isActive: true
  },
  {
    name: "Lions Club Navi Mumbai",
    address: "Sanpada, Navi Mumbai",
    pincode: "400705",
    coordinates: [73.0080, 19.0543],
    timings: "8:00 AM - 8:00 PM",
    isActive: true
  },
  {
    name: "Navi Mumbai Seva Sansthan",
    address: "Airoli, Navi Mumbai",
    pincode: "400708",
    coordinates: [73.0080, 19.1514],
    timings: "9:00 AM - 5:00 PM",
    isActive: true
  },
  {
    name: "Navi Mumbai Roti Bank",
    address: "CBD Belapur, Navi Mumbai",
    pincode: "400614",
    coordinates: [73.0314, 19.0178],
    timings: "24 Hours",
    isActive: true
  },
  {
    name: "Navi Mumbai Welfare Association",
    address: "Kharghar, Navi Mumbai",
    pincode: "410210",
    coordinates: [73.0665, 19.0473],
    timings: "8:30 AM - 6:30 PM",
    isActive: true
  },
  {
    name: "NMMC Food Bank",
    address: "Turbhe, Navi Mumbai",
    pincode: "400703",
    coordinates: [73.0197, 19.0756],
    timings: "9:00 AM - 5:00 PM",
    isActive: true
  },
  {
    name: "Navi Mumbai Seva Sadan",
    address: "Kopar Khairane, Navi Mumbai",
    pincode: "400709",
    coordinates: [73.0197, 19.1031],
    timings: "10:00 AM - 8:00 PM",
    isActive: true
  }
];

// Combine all locations
const allDropLocations = [
  ...mumbaiLocations,
  ...thaneLocations,
  ...ulhasnagarLocations,
  ...kalyanLocations,
  ...naviMumbaiLocations
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
      const result = await DropLocation.insertMany(allDropLocations);
      console.log(`Successfully seeded ${result.length} drop locations`);
      
      // Log the count by area
      console.log(`Mumbai: ${mumbaiLocations.length} locations`);
      console.log(`Thane: ${thaneLocations.length} locations`);
      console.log(`Ulhasnagar: ${ulhasnagarLocations.length} locations`);
      console.log(`Kalyan: ${kalyanLocations.length} locations`);
      console.log(`Navi Mumbai: ${naviMumbaiLocations.length} locations`);
      console.log(`Total: ${allDropLocations.length} locations`);
      
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
