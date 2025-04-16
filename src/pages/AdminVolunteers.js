import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { volunteerService } from '../services/api';
import { FaSearch } from 'react-icons/fa';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #F8F9FA;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #344767;
  font-family: 'Roboto', sans-serif;
`;

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  position: relative;
`;

const SearchInput = styled.input`
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  font-size: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  border-bottom: 1px solid #dee2e6;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 0.5rem;
  border: none;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => {
    switch(props.status) {
      case 'pending': return '#FFF3CD';
      case 'approved': return '#D1E7DD';
      case 'rejected': return '#F8D7DA';
      default: return '#E2E3E5';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'pending': return '#856404';
      case 'approved': return '#0F5132';
      case 'rejected': return '#842029';
      default: return '#41464B';
    }
  }};
`;

const AdminVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true);
      try {
        const response = await volunteerService.getAllVolunteers();
        if (response.success) {
          setVolunteers(response.data);
        } else {
          alert('Error fetching volunteers');
        }
      } catch (error) {
        alert('Error fetching volunteers');
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, []);

  const handleVolunteerStatusChange = async (volunteerId, newStatus) => {
    setActionLoading(true);
    try {
      const response = await volunteerService.updateVolunteerStatus(volunteerId, null, newStatus);
      if (response.success) {
        setVolunteers(volunteers.map(v => v._id === volunteerId ? { ...v, status: newStatus } : v));
        alert(`Volunteer ${newStatus} successfully`);
      } else {
        alert(response.message || `Error ${newStatus} volunteer`);
      }
    } catch (error) {
      alert(`Error ${newStatus} volunteer`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredVolunteers = volunteers.filter(v =>
    (statusFilter === 'all' || v.status === statusFilter) &&
    (!searchTerm || v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.email.toLowerCase().includes(searchTerm.toLowerCase()) || v.phone.includes(searchTerm))
  );

  return (
    <PageWrapper>
      <Container>
        <Title>Volunteer Management</Title>
        <SearchContainer>
          <FaSearch style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
          <SearchInput
            type="text"
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </SearchContainer>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>#</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <Td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>No volunteers found.</Td>
                </tr>
              ) : (
                filteredVolunteers.map((v, idx) => (
                  <tr key={v._id}>
                    <Td>{idx + 1}</Td>
                    <Td>{v.name}</Td>
                    <Td>{v.email}</Td>
                    <Td>{v.phone}</Td>
                    <Td><StatusBadge status={v.status}>{v.status}</StatusBadge></Td>
                    <Td>
                      {v.status !== 'approved' && (
                        <ActionButton disabled={actionLoading} style={{ background: '#D1E7DD', color: '#0F5132' }} onClick={() => handleVolunteerStatusChange(v._id, 'approved')}>Approve</ActionButton>
                      )}
                      {v.status !== 'rejected' && (
                        <ActionButton disabled={actionLoading} style={{ background: '#F8D7DA', color: '#842029' }} onClick={() => handleVolunteerStatusChange(v._id, 'rejected')}>Reject</ActionButton>
                      )}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
        <ActionButton style={{ marginTop: '2rem', background: '#e9ecef', color: '#495057' }} onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </ActionButton>
      </Container>
    </PageWrapper>
  );
};

export default AdminVolunteers;
