import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import GroupCard from '../components/GroupCard';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token);
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate('/login');
      return;
    }
    console.log("Token found, fetching groups");
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      console.log("Making request to /api/groups/");
      const response = await api.get('/groups/');
      console.log("Raw API response:", response);
      console.log("Groups data:", response.data);
      
      // Check if response.data exists and is an array
      if (!response.data) {
        console.error("No data in response");
        setGroups([]);
        return;
      }

      // If response.data is not an array, try to extract the groups array
      const groupsData = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      console.log("Processed groups data:", groupsData);
      setGroups(groupsData);
    } catch (error) {
      console.error('Error fetching groups:', error);
      let errorMessage = 'Error fetching groups';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Please check if the server is running at http://localhost:8000';
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        errorMessage = 'Authentication error: Please log in again';
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showSnackbar(errorMessage, 'error');
      setGroups([]); // Ensure groups is set to empty array on error
    }
  };

  // Add console log to check groups state
  useEffect(() => {
    console.log("Current groups state:", groups);
    console.log("Groups length:", groups.length);
    console.log("Groups type:", typeof groups);
    console.log("Is groups an array?", Array.isArray(groups));
  }, [groups]);

  const handleOpenDialog = (group = null) => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
      });
      setSelectedGroup(group);
    } else {
      setFormData({
        name: '',
        description: '',
      });
      setSelectedGroup(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      description: '',
    });
    setSelectedGroup(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedGroup) {
        const response = await api.put(`/groups/${selectedGroup._id}/`, formData);
        console.log("Update group response:", response.data);
        showSnackbar('Group updated successfully');
        await fetchGroups(); // Wait for groups to be fetched
        handleCloseDialog();
      } else {
        const response = await api.post('/groups/', formData);
        console.log("Create group response:", response.data);
        showSnackbar('Group created successfully');
        await fetchGroups(); // Wait for groups to be fetched
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error saving group:', error);
      let errorMessage = 'Error saving group';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Please check if the server is running at http://localhost:8000';
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized: Please log in again';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleDelete = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await api.delete(`/groups/${groupId}`);
        showSnackbar('Group deleted successfully');
        fetchGroups();
      } catch (error) {
        console.error('Error deleting group:', error);
        showSnackbar(error.response?.data?.message || 'Error deleting group', 'error');
      }
    }
  };

  const handleOpenUserDialog = async (group) => {
    setSelectedGroup(group);
    try {
      const response = await api.get(`/groups/${group._id}/users`);
      setUsers(response.data);
      setSelectedUsers(group.users || []);
      setOpenUserDialog(true);
    } catch (error) {
      console.error('Error fetching group users:', error);
      showSnackbar('Error fetching group users', 'error');
    }
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setSelectedGroup(null);
    setSelectedUsers([]);
  };

  const handleUserToggle = async (userId) => {
    try {
      if (selectedUsers.includes(userId)) {
        await api.delete(`/groups/${selectedGroup._id}/users/${userId}`);
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
        showSnackbar('User removed from group');
      } else {
        await api.post(`/groups/${selectedGroup._id}/users/${userId}`);
        setSelectedUsers([...selectedUsers, userId]);
        showSnackbar('User added to group');
      }
    } catch (error) {
      console.error('Error updating group users:', error);
      showSnackbar(error.response?.data?.message || 'Error updating group users', 'error');
    }
  };

  return (
    <section className="home-section">
      <div className="text">Groups Management</div>
      <div className="dashboard-content">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Add New Group
                  </Button>
                </Box>

                {groups.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" align="center">
                    No groups found. Create a new group to get started!
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
                    {groups.map((group) => (
                      <Grid item xs={12} sm={6} md={4} key={group._id}>
                        <GroupCard
                          group={group}
                          onEdit={handleOpenDialog}
                          onDelete={handleDelete}
                          onManageUsers={handleOpenUserDialog}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Group Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedGroup ? 'Edit Group' : 'Add New Group'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedGroup ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manage Users Dialog */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog} maxWidth="md" fullWidth>
        <DialogTitle>Manage Users in {selectedGroup?.name}</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button
                        variant={selectedUsers.includes(user._id) ? "contained" : "outlined"}
                        onClick={() => handleUserToggle(user._id)}
                      >
                        {selectedUsers.includes(user._id) ? 'Remove' : 'Add'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Groups;
