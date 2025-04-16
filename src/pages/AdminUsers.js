import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { authService } from '../services/api';

const AdminUsers = () => {
  // Initialize users from localStorage or use default values
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('appUsers');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return [
      {
        _id: '1',
        username: 'admin',
        email: 'admin@apnashelter.org',
        role: 'admin',
        isActive: true
      },
      {
        _id: '2',
        username: 'manager',
        email: 'manager@apnashelter.org',
        role: 'manager',
        isActive: true,
        associatedNgo: {
          id: 'ngo1',
          name: 'Example NGO',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001'
        }
      },
      {
        _id: '3',
        username: 'volunteer',
        email: 'volunteer@apnashelter.org',
        role: 'volunteer',
        isActive: true,
        selectedNgos: [
          {
            id: 'ngo1',
            name: 'Example NGO',
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400001'
          }
        ],
        serviceAreas: [
          {
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400001'
          }
        ]
      }
    ];
  });
  
  // NGO list for dropdown selection
  const [ngoList, setNgoList] = useState(() => {
    return [
      {
        id: 'ngo1',
        name: 'Example NGO',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400001'
      },
      {
        id: 'ngo2',
        name: 'Helping Hands',
        city: 'Delhi',
        state: 'Delhi',
        pinCode: '110001'
      },
      {
        id: 'ngo3',
        name: 'Food For All',
        city: 'Bangalore',
        state: 'Karnataka',
        pinCode: '560001'
      }
    ];
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'volunteer',
    isActive: true,
    selectedNgos: [],
    serviceAreas: [],
    associatedNgo: null
  });
  
  // For service area management
  const [showServiceAreaModal, setShowServiceAreaModal] = useState(false);
  const [serviceAreaForm, setServiceAreaForm] = useState({
    city: '',
    state: '',
    pinCode: ''
  });
  
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const itemsPerPage = 20;

  // Check authentication
  useEffect(() => {
    const token = authService.getToken();
    const userRole = localStorage.getItem('userRole');
    console.log('Token in AdminUsers:', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('User role:', userRole);
    
    if (!token || userRole !== 'admin') {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appUsers', JSON.stringify(users));
  }, [users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Use the authService to fetch users
      const result = await authService.getAllUsers();
      
      if (result.success) {
        setUsers(result.users);
      } else {
        console.error('Error fetching users:', result.message);
        setError(result.message || 'Failed to fetch users');
        
        // Fallback to localStorage if API fails
        const savedUsers = localStorage.getItem('appUsers');
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      
      // Fallback to localStorage if API fails
      const savedUsers = localStorage.getItem('appUsers');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'volunteer',
      isActive: true
    });
    setShowModal(true);
  };

  const handleAddUserSubmit = async () => {
    try {
      setLoading(true);
      
      // Use authService to register a new user
      const result = await authService.register(formData);
      
      if (result.success) {
        // Add new user to the list
        setUsers([...users, result.user]);
        setShowModal(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'volunteer',
          isActive: true
        });
      } else {
        setError(result.message || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      
      // Use authService to update the user
      const result = await authService.updateUser(editingUser._id, formData);
      
      if (result.success) {
        // Update user in the list
        setUsers(users.map(user => user._id === editingUser._id ? result.user : user));
        setShowModal(false);
        setEditingUser(null);
      } else {
        setError(result.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirmDelete !== userId) {
      setConfirmDelete(userId);
      return;
    }
    
    try {
      setLoading(true);
      
      // Use authService to delete the user
      const result = await authService.deleteUser(userId);
      
      if (result.success) {
        // Remove user from the list
        setUsers(users.filter(user => user._id !== userId));
        setConfirmDelete(null);
      } else {
        setError(result.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Don't populate password for security
      role: user.role,
      isActive: user.isActive,
      associatedNgo: user.associatedNgo || null,
      selectedNgos: user.selectedNgos || [],
      serviceAreas: user.serviceAreas || []
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingUser) {
      handleUpdateUser();
    } else {
      handleAddUserSubmit();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle NGO selection for volunteers
  const handleNgoSelection = (e) => {
    const ngoId = e.target.value;
    const selectedNgo = ngoList.find(ngo => ngo.id === ngoId);
    
    if (selectedNgo) {
      // Check if this NGO is already selected
      const alreadySelected = formData.selectedNgos.some(ngo => ngo.id === ngoId);
      
      if (!alreadySelected) {
        setFormData({
          ...formData,
          selectedNgos: [...formData.selectedNgos, selectedNgo]
        });
      }
    }
  };
  
  // Remove an NGO from selection
  const handleRemoveNgo = (ngoId) => {
    setFormData({
      ...formData,
      selectedNgos: formData.selectedNgos.filter(ngo => ngo.id !== ngoId)
    });
  };
  
  // Handle service area form changes
  const handleServiceAreaChange = (e) => {
    const { name, value } = e.target;
    setServiceAreaForm({
      ...serviceAreaForm,
      [name]: value
    });
  };
  
  // Add service area to volunteer
  const handleAddServiceArea = () => {
    // Validate service area form
    if (!serviceAreaForm.city || !serviceAreaForm.state || !serviceAreaForm.pinCode) {
      setError('Please fill all service area fields');
      return;
    }
    
    // Add service area to form data
    setFormData({
      ...formData,
      serviceAreas: [...formData.serviceAreas, { ...serviceAreaForm }]
    });
    
    // Reset service area form
    setServiceAreaForm({
      city: '',
      state: '',
      pinCode: ''
    });
    
    // Close modal
    setShowServiceAreaModal(false);
  };
  
  // Remove service area
  const handleRemoveServiceArea = (index) => {
    setFormData({
      ...formData,
      serviceAreas: formData.serviceAreas.filter((_, i) => i !== index)
    });
  };
  
  // Handle associated NGO selection for managers
  const handleAssociatedNgoChange = (e) => {
    const ngoId = e.target.value;
    if (ngoId === '') {
      setFormData({
        ...formData,
        associatedNgo: null
      });
    } else {
      const selectedNgo = ngoList.find(ngo => ngo.id === ngoId);
      if (selectedNgo) {
        setFormData({
          ...formData,
          associatedNgo: selectedNgo
        });
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }
    return user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/admin/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
        <h1>User Management</h1>
        <AddButton onClick={handleAddUser}>
          <FaUserPlus /> Add New User
        </AddButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SearchContainer>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search users"
        />
        <RoleFilterSelect
          value={roleFilter}
          onChange={handleRoleFilter}
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="volunteer">Volunteer</option>
        </RoleFilterSelect>
      </SearchContainer>

      {loading ? (
        <LoadingContainer>
          <FaSpinner className="spinner" /> Loading users...
        </LoadingContainer>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Associated NGO</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr key={user._id}>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <RoleBadge role={user.role}>{user.role}</RoleBadge>
                  </Td>
                  <Td>
                    {user.role === 'manager' && user.associatedNgo ? (
                      <NgoInfo>{user.associatedNgo.name}</NgoInfo>
                    ) : (
                      <span>-</span>
                    )}
                  </Td>
                  <Td>
                    <StatusBadge active={user.isActive}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <ActionButtons>
                      <ActionButton 
                        onClick={() => handleEditUser(user)}
                        title="Edit user"
                      >
                        <FaEdit />
                      </ActionButton>
                      
                      <ActionButton 
                        onClick={() => handleDeleteUser(user._id)}
                        color={confirmDelete === user._id ? '#c0392b' : '#e74c3c'}
                        title={confirmDelete === user._id ? 'Click again to confirm deletion' : 'Delete user'}
                      >
                        <FaTrash />
                      </ActionButton>
                    </ActionButtons>
                  </Td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <Td colSpan="6" style={{ textAlign: 'center' }}>
                    No users found
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
          <Pagination>
            <PaginationButton
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            <PaginationButton
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)}
            >
              Next
            </PaginationButton>
          </Pagination>
        </TableContainer>
      )}

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Username</Label>
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>{editingUser ? 'New Password (leave blank to keep current)' : 'Password'}</Label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editingUser}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Role</Label>
                  <Select 
                    name="role" 
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="volunteer">Volunteer</option>
                  </Select>
                </FormGroup>
                
                {/* Manager-specific fields */}
                {formData.role === 'manager' && (
                  <FormGroup>
                    <Label>Associated NGO</Label>
                    <Select
                      name="associatedNgo"
                      value={formData.associatedNgo ? formData.associatedNgo.id : ''}
                      onChange={handleAssociatedNgoChange}
                    >
                      <option value="">Select an NGO</option>
                      {ngoList.map(ngo => (
                        <option key={ngo.id} value={ngo.id}>{ngo.name} - {ngo.city}</option>
                      ))}
                    </Select>
                  </FormGroup>
                )}
                
                {/* Volunteer-specific fields */}
                {formData.role === 'volunteer' && (
                  <>
                    <FormGroup>
                      <Label>Selected NGOs</Label>
                      <Select
                        name="selectedNgos"
                        value=""
                        onChange={handleNgoSelection}
                      >
                        <option value="">Add an NGO</option>
                        {ngoList.map(ngo => (
                          <option key={ngo.id} value={ngo.id}>{ngo.name} - {ngo.city}</option>
                        ))}
                      </Select>
                      
                      {formData.selectedNgos.length > 0 && (
                        <NgoList>
                          {formData.selectedNgos.map(ngo => (
                            <NgoItem key={ngo.id}>
                              <NgoName>{ngo.name}</NgoName>
                              <NgoLocation>{ngo.city}, {ngo.state}</NgoLocation>
                              <RemoveButton onClick={() => handleRemoveNgo(ngo.id)}>
                                <FaTimes />
                              </RemoveButton>
                            </NgoItem>
                          ))}
                        </NgoList>
                      )}
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>Service Areas</Label>
                      <AddButton type="button" onClick={() => setShowServiceAreaModal(true)}>
                        Add Service Area
                      </AddButton>
                      
                      {formData.serviceAreas.length > 0 && (
                        <ServiceAreaList>
                          {formData.serviceAreas.map((area, index) => (
                            <ServiceAreaItem key={index}>
                              <ServiceAreaName>{area.city}, {area.state}</ServiceAreaName>
                              <ServiceAreaPincode>PIN: {area.pinCode}</ServiceAreaPincode>
                              <RemoveButton onClick={() => handleRemoveServiceArea(index)}>
                                <FaTimes />
                              </RemoveButton>
                            </ServiceAreaItem>
                          ))}
                        </ServiceAreaList>
                      )}
                    </FormGroup>
                  </>
                )}
                
                <FormGroup>
                  <CheckboxLabel>
                    <Checkbox 
                      type="checkbox" 
                      name="isActive" 
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    Active
                  </CheckboxLabel>
                </FormGroup>
                
                <ButtonGroup>
                  <CancelButton type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit">
                    {editingUser ? 'Update User' : 'Create User'}
                  </SubmitButton>
                </ButtonGroup>
              </Form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    margin: 0;
    color: #344767;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  color: #495057;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
  background-color: ${props => {
    switch(props.role) {
      case 'admin': return '#e3f2fd';
      case 'manager': return '#e8f5e9';
      default: return '#fff3e0';
    }
  }};
  color: ${props => {
    switch(props.role) {
      case 'admin': return '#1976d2';
      case 'manager': return '#388e3c';
      default: return '#f57c00';
    }
  }};
`;

const NgoInfo = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: #e8f5e9;
  color: #388e3c;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${props => props.active ? '#e8f5e9' : '#ffebee'};
  color: ${props => props.active ? '#388e3c' : '#d32f2f'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  background-color: ${props => props.color || '#4a90e2'};
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  
  h2 {
    margin: 0;
    color: #344767;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #343a40;
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #495057;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.25);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.25);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const CancelButton = styled(Button)`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #4a90e2;
  border: none;
  color: white;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.25);
  }
`;

const RoleFilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.25);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  
  &:hover {
    background-color: #e9ecef;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Service Area Modal
const ServiceAreaModal = ({ show, onClose, serviceAreaForm, onChange, onSubmit }) => {
  if (!show) return null;
  
  return (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <h2>Add Service Area</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                value={serviceAreaForm.city}
                onChange={onChange}
                placeholder="City"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>State</Label>
              <Input
                type="text"
                name="state"
                value={serviceAreaForm.state}
                onChange={onChange}
                placeholder="State"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>PIN Code</Label>
              <Input
                type="text"
                name="pinCode"
                value={serviceAreaForm.pinCode}
                onChange={onChange}
                placeholder="PIN Code"
                required
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <SubmitButton onClick={onSubmit}>Add Service Area</SubmitButton>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Additional styled components
const NgoList = styled.div`
  margin-top: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

const NgoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ced4da;
  
  &:last-child {
    border-bottom: none;
  }
`;

const NgoName = styled.div`
  font-weight: 600;
  color: #495057;
`;

const NgoLocation = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
`;

const ServiceAreaList = styled.div`
  margin-top: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

const ServiceAreaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ced4da;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ServiceAreaName = styled.div`
  font-weight: 600;
  color: #495057;
`;

const ServiceAreaPincode = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  
  &:hover {
    background-color: #f8d7da;
  }
`;

const ServiceAreaAddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 4px;
  color: #495057;
  cursor: pointer;
  font-size: 0.875rem;
  width: 100%;
  
  &:hover {
    background-color: #dee2e6;
  }
`;

const ModalFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
`;

export default AdminUsers;
