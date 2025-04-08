import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #FFF4E0;
`;

const Container = styled.div`
  max-width: 500px;
  margin: 4rem auto;
  padding: 0 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  color: #344767;
  margin-bottom: 2rem;
  font-family: 'Roboto', sans-serif;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #666;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007DBC;
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #003669;
  border: none;
  color: white;
  margin-top: 1rem;
  
  &:hover {
    background: #002850;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    // For demo purposes, we'll use a hardcoded admin credential
    // In a real app, this would be an API call to validate credentials
    if (formData.username === 'admin' && formData.password === 'admin123') {
      // Store authentication in localStorage (in a real app, use a proper auth token)
      localStorage.setItem('adminAuthenticated', 'true');
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <Card>
          <FormTitle>Admin Login</FormTitle>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>Username</Label>
              <Input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username" 
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Password</Label>
              <Input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password" 
              />
            </InputGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Button type="submit">Login</Button>
          </Form>
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default AdminLogin;
