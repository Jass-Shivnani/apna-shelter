// Mock API services (temporary until dependencies are installed)

// Get base API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Authentication service
const authService = {
  // Set token in localStorage
  setToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
      console.log('Token set:', token.substring(0, 20) + '...');
    } else {
      localStorage.removeItem('authToken');
      console.log('Token removed');
    }
  },
  
  // Get token from localStorage
  getToken: () => {
    const token = localStorage.getItem('authToken');
    console.log('Getting token:', token ? token.substring(0, 20) + '...' : 'No token');
    return token;
  },
  
  // Get auth header
  getAuthHeader: () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return {};
    }
    return { 'Authorization': `Bearer ${token}` };
  },
  
  // Register a new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        authService.setToken(data.token);
        return {
          success: true,
          message: data.message,
          user: data.user
        };
      } else {
        return {
          success: false,
          message: data.message
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'An error occurred during registration'
      };
    }
  },
  
  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (data.success) {
        // Store token and user info in localStorage
        authService.setToken(data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('currentUser', JSON.stringify({
          id: data.user._id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
          associatedNgo: data.user.associatedNgo
        }));
        
        return {
          success: true,
          message: data.message,
          user: data.user
        };
      } else {
        return {
          success: false,
          message: data.message
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  },
  
  // Logout user
  logout: () => {
    authService.setToken(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  },
  
  // Get current user
  getCurrentUser: () => {
    try {
      const userString = localStorage.getItem('currentUser');
      
      if (!userString) {
        return null;
      }
      
      return JSON.parse(userString);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!authService.getToken();
  },
  
  // Check if user has admin role
  isAdmin: () => {
    return localStorage.getItem('userRole') === 'admin';
  },
  
  // Check if user has manager role or higher
  isManager: () => {
    const role = localStorage.getItem('userRole');
    return role === 'admin' || role === 'manager';
  },
  
  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/users`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          users: data.users
        };
      } else {
        return {
          success: false,
          message: data.message
        };
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        message: 'Failed to fetch users'
      };
    }
  },
  
  // Update user (admin only)
  updateUser: async (userId, userData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/users/${userId}`, {
        method: 'PUT',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          user: data.user,
          message: data.message
        };
      } else {
        return {
          success: false,
          message: data.message
        };
      }
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        message: 'Failed to update user'
      };
    }
  },
  
  // Delete user (admin only)
  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          message: data.message
        };
      } else {
        return {
          success: false,
          message: data.message
        };
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: 'Failed to delete user'
      };
    }
  }
};

// Geocoding service
const geocodeService = {
  // Reverse geocode (coordinates to address)
  reverseGeocode: async (lat, lng) => {
    try {
      const response = await fetch(`${API_URL}/api/geocode/reverse?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Error in reverse geocoding');
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return { success: false, message: 'Failed to reverse geocode' };
    }
  },
  
  // Forward geocode (address to coordinates)
  forwardGeocode: async (address) => {
    try {
      const response = await fetch(`${API_URL}/api/geocode/forward?address=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Error in forward geocoding');
      }
    } catch (error) {
      console.error('Forward geocoding error:', error);
      return { success: false, message: 'Failed to forward geocode' };
    }
  },
  
  // Find nearby locations by pincode
  findNearbyByPincode: async (pincode) => {
    try {
      const response = await fetch(`${API_URL}/api/geocode/nearby?pincode=${pincode}`);
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Error finding nearby locations');
      }
    } catch (error) {
      console.error('Find nearby locations error:', error);
      return { success: false, message: 'Failed to find nearby locations' };
    }
  }
};

// Donation service
const donationService = {
  // Create a new donation
  createDonation: async (donationData) => {
    try {
      const response = await fetch(`${API_URL}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData)
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating donation:', error);
      return { success: false, message: 'Failed to create donation' };
    }
  },
  
  // Get all donations (admin only)
  getAllDonations: async () => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/api/donations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching donations:', error);
      return { success: false, message: 'Failed to fetch donations' };
    }
  },
  
  // Update donation status (admin only)
  updateDonationStatus: async (id, status) => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/api/donations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating donation status:', error);
      return { success: false, message: 'Failed to update donation status' };
    }
  },
  
  // Find nearby drop locations
  findNearbyDropLocations: async (pincode) => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/api/donations/drop-locations/nearby?pincode=${pincode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Error finding nearby drop locations');
      }
    } catch (error) {
      console.error('Find nearby drop locations error:', error);
      return { success: false, message: 'Failed to find nearby drop locations' };
    }
  },
  
  // Get all drop locations
  getAllDropLocations: async () => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/api/donations/drop-locations/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Error getting drop locations');
      }
    } catch (error) {
      console.error('Get all drop locations error:', error);
      return { success: false, message: 'Failed to get drop locations' };
    }
  }
};

// Admin service for managing drop locations
const adminService = {
  // Get all drop locations
  getAllDropLocations: async () => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/api/admin/drop-locations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching drop locations:', error);
      return { success: false, message: 'Failed to fetch drop locations' };
    }
  },
  
  // Create a new drop location
  createDropLocation: async (locationData) => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/api/admin/drop-locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(locationData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Error creating drop location');
      }
    } catch (error) {
      console.error('Create drop location error:', error);
      return { success: false, message: error.message };
    }
  },
  
  // Update a drop location
  updateDropLocation: async (id, locationData) => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/api/admin/drop-locations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(locationData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Error updating drop location');
      }
    } catch (error) {
      console.error('Update drop location error:', error);
      return { success: false, message: error.message };
    }
  },
  
  // Delete a drop location
  deleteDropLocation: async (id) => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/api/admin/drop-locations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Error deleting drop location');
      }
    } catch (error) {
      console.error('Delete drop location error:', error);
      return { success: false, message: error.message };
    }
  },
  
  // Toggle a drop location's active status
  toggleDropLocationStatus: async (id) => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/api/admin/drop-locations/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Error toggling drop location status');
      }
    } catch (error) {
      console.error('Toggle drop location status error:', error);
      return { success: false, message: error.message };
    }
  }
};

// Volunteer service for managing volunteer-NGO associations
export const volunteerService = {
  // Get all volunteers for a manager's NGO
  getVolunteersForManager: async (ngoId) => {
    try {
      // If no NGO ID is provided, return all volunteers (admin view)
      const endpoint = ngoId ? 
        `${API_URL}/api/ngos/${ngoId}/volunteers` : 
        `${API_URL}/api/volunteers`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      return { success: false, message: 'Failed to fetch volunteers' };
    }
  },
  
  // Get volunteers for a specific NGO
  getVolunteersForNgo: async (ngoId) => {
    try {
      const response = await fetch(`${API_URL}/api/ngos/${ngoId}/volunteers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      return { success: false, message: 'Failed to fetch volunteers' };
    }
  },
  
  // Get pending applications for an NGO
  getPendingApplications: async (ngoId) => {
    try {
      const response = await fetch(`${API_URL}/api/ngos/${ngoId}/applications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching pending applications:', error);
      return { success: false, message: 'Failed to fetch applications' };
    }
  },
  
  // Process volunteer application (approve/reject)
  processApplication: async (applicationId, action) => {
    try {
      const response = await fetch(`${API_URL}/api/applications/${applicationId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error processing application:', error);
      return { success: false, message: 'Failed to process application' };
    }
  },
  
  // Update volunteer status
  updateVolunteerStatus: async (volunteerId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/volunteers/${volunteerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: newStatus })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      return { success: false, message: 'Failed to update volunteer status' };
    }
  },
  
  // Request to work with an NGO (for volunteers)
  requestToWorkWithNgo: async (volunteerId, ngoId) => {
    try {
      const response = await fetch(`${API_URL}/api/volunteers/${volunteerId}/request-ngo/${ngoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error requesting to work with NGO:', error);
      return { success: false, message: 'Failed to submit request' };
    }
  }
};

// NGO Service
export const ngoService = {
  getAllNgos: async () => {
    try {
      const response = await fetch(`${API_URL}/api/ngos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // First try to parse the response as JSON
      const data = await response.json();
      console.log('API response for getAllNgos:', data);
      
      // Check if the response has a data property
      if (data && data.data) {
        return data;
      } 
      // Check if the response is an array
      else if (data && Array.isArray(data)) {
        return { success: true, data: data };
      }
      // Check if the response itself contains NGO objects
      else if (data && typeof data === 'object') {
        const possibleNgos = Object.values(data).filter(item => 
          item && typeof item === 'object' && item.name && (item._id || item.id)
        );
        
        if (possibleNgos.length > 0) {
          return { success: true, data: possibleNgos };
        }
      }
      
      // If we couldn't parse the data in any expected format, return an error
      console.error('Unexpected NGO data format:', data);
      return { 
        success: false, 
        message: 'Failed to parse NGO data',
        originalData: data 
      };
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      return { success: false, message: 'Failed to fetch NGOs: ' + (error.message || 'Unknown error') };
    }
  },
  
  getVolunteerApplications: async (volunteerId) => {
    try {
      const response = await fetch(`${API_URL}/api/volunteers/${volunteerId}/applications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching volunteer applications:', error);
      return { success: false, message: 'Failed to fetch applications' };
    }
  },
  
  applyForNgo: async (applicationData) => {
    try {
      const response = await fetch(`${API_URL}/api/volunteers/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(applicationData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error applying for NGO:', error);
      return { success: false, message: 'Failed to submit application' };
    }
  }
};

export { 
  authService, 
  donationService, 
  adminService, 
  geocodeService 
};
