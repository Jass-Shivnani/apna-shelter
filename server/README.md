# Apna Shelter Backend

This is the backend server for the Apna Shelter donation form application, providing API endpoints for the interactive map feature and donation form submission.

## Features

- Reverse geocoding API for the interactive map
- Form data validation and submission
- Drop location management
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/apna-shelter
   NODE_ENV=development
   ```

## Database Setup

Seed the database with initial drop locations:

```
node seed/seedDropLocations.js
```

## Running the Server

Development mode with auto-restart:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Geocoding

- `GET /api/geocode/reverse` - Reverse geocode coordinates to address
- `GET /api/geocode/forward` - Forward geocode address to coordinates
- `GET /api/geocode/nearby` - Find nearby locations by pincode

### Donations

- `POST /api/donations` - Create a new donation
- `GET /api/donations` - Get all donations (admin access)
- `GET /api/donations/:id` - Get donation by ID
- `PUT /api/donations/:id` - Update donation status
- `GET /api/donations/drop-locations/all` - Get all drop locations
- `GET /api/donations/drop-locations/nearby` - Find nearby drop locations by pincode

## Integration with Frontend

The frontend React application connects to this backend server using the API service defined in `src/services/api.js`. Make sure the frontend's `.env` file has the correct API URL:

```
REACT_APP_API_URL=http://localhost:5000/api
```
