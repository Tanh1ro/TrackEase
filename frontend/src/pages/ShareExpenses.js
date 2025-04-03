import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Receipt as ReceiptIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../css/dashboard.css';

const ShareExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEntryTypeDialog, setOpenEntryTypeDialog] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    groupId: '',
    category: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchExpenses();
    fetchGroups();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses/');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      showSnackbar('Error fetching expenses', 'error');
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups/');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      showSnackbar('Error fetching groups', 'error');
    }
  };

  const handleOpenDialog = () => {
    setOpenEntryTypeDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      description: '',
      amount: '',
      groupId: '',
      category: '',
    });
  };

  const handleCloseEntryTypeDialog = () => {
    setOpenEntryTypeDialog(false);
  };

  const handleEntryTypeSelect = (type) => {
    setOpenEntryTypeDialog(false);
    if (type === 'scan') {
      // TODO: Implement scan functionality
      showSnackbar('Scan functionality coming soon!', 'info');
    } else {
      setFormData({
        description: '',
        amount: '',
        groupId: '',
        category: '',
      });
      setOpenDialog(true);
    }
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
      await api.post('/expenses/', formData);
      showSnackbar('Expense added successfully');
      handleCloseDialog();
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      showSnackbar('Error adding expense', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section className="home-section">
      <div className="text">Share Expenses</div>
      <div className="dashboard-content">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                  >
                    Add New Expense
                  </Button>
                </Box>

                {expenses.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" align="center">
                    No expenses found. Add a new expense to get started!
                  </Typography>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Group</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {expenses.map((expense) => (
                          <TableRow key={expense._id}>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell>₹{expense.amount}</TableCell>
                            <TableCell>{expense.group?.name}</TableCell>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entry Type Selection Dialog */}
      <Dialog open={openEntryTypeDialog} onClose={handleCloseEntryTypeDialog}>
        <DialogTitle>Choose Entry Method</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ReceiptIcon />}
              onClick={() => handleEntryTypeSelect('scan')}
              sx={{ py: 2 }}
            >
              Scan Receipt
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => handleEntryTypeSelect('manual')}
              sx={{ py: 2 }}
            >
              Manual Entry
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEntryTypeDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Manual Entry Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Group</InputLabel>
              <Select
                name="groupId"
                value={formData.groupId}
                onChange={handleInputChange}
                required
              >
                {groups.map((group) => (
                  <MenuItem key={group._id} value={group._id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="transportation">Transportation</MenuItem>
                <MenuItem value="utilities">Utilities</MenuItem>
                <MenuItem value="entertainment">Entertainment</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Expense
          </Button>
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

export default ShareExpenses; 