/**
 * @file Groups.js
 * @description Component for managing user groups and group-related operations
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 * 
 * This component provides:
 * 1. Group creation and management
 * 2. Member invitation and management
 * 3. Group settings and preferences
 * 4. Group activity and statistics
 */


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip as MuiTooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Snackbar,
  Alert,
  Avatar,
  Tab,
  Tabs,
  Menu,
  MenuItem as MuiMenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Restaurant as FoodIcon,
  ShoppingCart as GroceriesIcon,
  Flight as TravelIcon,
  Hotel as StaysIcon,
  Subscriptions as SubscriptionIcon,
  LocalMall as ShoppingIcon,
  CardGiftcard as GiftsIcon,
  LocalDrink as DrinksIcon,
  LocalGasStation as FuelIcon,
  AccountBalance as UdhaarIcon,
  Favorite as HealthIcon,
  TheaterComedy as EntertainmentIcon,
  More as MiscIcon,
  Groups as RoommatesIcon,
  Favorite as CoupleIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Celebration as PartyIcon,
  Category as OtherIcon,
  UploadFile as UploadIcon,
  Close as CloseIcon,
  PictureAsPdf as PictureAsPdfIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import '../css/Dashboard.css';

const expenseCategories = [
  { id: 'food', name: 'Food', icon: <FoodIcon />, color: '#FFD700' },
  { id: 'groceries', name: 'Groceries', icon: <GroceriesIcon />, color: '#FF9999' },
  { id: 'travel', name: 'Travel', icon: <TravelIcon />, color: '#87CEEB' },
  { id: 'stays', name: 'Stays', icon: <StaysIcon />, color: '#DEB887' },
  { id: 'bills', name: 'Bills', icon: <MoneyIcon />, color: '#E6E6FA' },
  { id: 'subscription', name: 'Subscription', icon: <SubscriptionIcon />, color: '#FFC0CB' },
  { id: 'shopping', name: 'Shopping', icon: <ShoppingIcon />, color: '#98FB98' },
  { id: 'gifts', name: 'Gifts', icon: <GiftsIcon />, color: '#DDA0DD' },
  { id: 'drinks', name: 'Drinks', icon: <DrinksIcon />, color: '#FFA07A' },
  { id: 'fuel', name: 'Fuel', icon: <FuelIcon />, color: '#90EE90' },
  { id: 'udhaar', name: 'Debt', icon: <UdhaarIcon />, color: '#FFB6C1' },
  { id: 'health', name: 'Health', icon: <HealthIcon />, color: '#98FB98' },
  { id: 'entertainment', name: 'Entertainment', icon: <EntertainmentIcon />, color: '#87CEEB' },
  { id: 'misc', name: 'Misc.', icon: <MiscIcon />, color: '#D3D3D3' },
];

const groupTypes = [
  { id: 'travel', name: 'Travel', icon: <TravelIcon />, requiresDates: true, requiresBudget: true },
  { id: 'roommates', name: 'Roommates', icon: <RoommatesIcon />, requiresDates: false, requiresBudget: false },
  { id: 'couple', name: 'Couple', icon: <CoupleIcon />, requiresDates: false, requiresBudget: false },
  { id: 'work', name: 'Work', icon: <WorkIcon />, requiresDates: false, requiresBudget: false },
  { id: 'event', name: 'Event', icon: <EventIcon />, requiresDates: false, requiresBudget: true },
  { id: 'party', name: 'Party', icon: <PartyIcon />, requiresDates: false, requiresBudget: true },
  { id: 'other', name: 'Other', icon: <OtherIcon />, requiresDates: false, requiresBudget: false },
];

const splitTypes = [
  { id: 'equal', name: 'Equally' },
  { id: 'percentage', name: 'Percentage' },
  { id: 'custom', name: 'On Own' },
];

const GroupsComponent = () => {
  const { userData } = useUser();
  const { colors, isDarkMode } = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    startDate: '',
    endDate: '',
    budget: '',
    members: [],
    expenses: []
  });
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: '',
    paidBy: '',
    splitType: 'equal',
    splits: [],
    receipt: null,
    date: new Date().toISOString().split('T')[0]
  });
  const [customSplits, setCustomSplits] = useState({});
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showPaidByMenu, setShowPaidByMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
  const [showSplitFields, setShowSplitFields] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groups');
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError('Failed to fetch groups');
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: '', description: '', type: '', startDate: '', endDate: '', budget: '', members: [], expenses: [] });
  };

  const handleOpenEditDialog = (group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      type: group.type,
      startDate: group.startDate || '',
      endDate: group.endDate || '',
      budget: group.budget || '',
      members: [...(group.members || [])],
      expenses: [...(group.expenses || [])]
    });
    setEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialog(false);
    setSelectedGroup(null);
    setFormData({
      name: '',
      description: '',
      type: '',
      startDate: '',
      endDate: '',
      budget: '',
      members: [],
      expenses: []
    });
  };

  const handleAddMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, '']
    }));
  };

  const handleRemoveMember = (index) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const handleMemberChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => i === index ? value : member)
    }));
  };

  const handleAddExpense = async (expense) => {
    try {
      // Create a new group object
      const newGroup = {
        ...formData,
        _id: Date.now(), // Temporary ID until server response
        createdAt: new Date().toISOString(),
        totalExpenses: 0,
        members: formData.members.filter(member => member.trim() !== ''),
        expenses: [...formData.expenses, expense]
      };

      // Optimistically add the group to the UI
      setGroups(prev => [...prev, newGroup]);
      
      // Close the dialog and show success message
      handleCloseDialog();
      setSuccess('Group created successfully');

      // Make API call to persist the group
      const response = await fetch('http://localhost:5000/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const savedGroup = await response.json();
      
      // Update the group in state with the server response
      setGroups(prev => prev.map(group => 
        group._id === newGroup._id ? savedGroup : group
      ));

    } catch (err) {
      // If there's an error, remove the optimistically added group
      setGroups(prev => prev.filter(group => group._id !== formData._id));
      setError('Failed to create group. Please try again.');
    }
  };

  const handleRemoveExpense = (expenseId) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== expenseId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.type) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate dates for travel groups
    if (formData.type === 'travel' && (!formData.startDate || !formData.endDate)) {
      setError('Please select start and end dates for travel group');
      return;
    }

    // Validate budget for travel, event, and party groups
    if ((formData.type === 'travel' || formData.type === 'event' || formData.type === 'party') && !formData.budget) {
      setError('Please set a budget for this group type');
      return;
    }

    try {
      // Create a new group object
      const newGroup = {
        ...formData,
        _id: Date.now(), // Temporary ID until server response
        createdAt: new Date().toISOString(),
        totalExpenses: 0,
        members: formData.members.filter(member => member.trim() !== ''),
        expenses: []
      };

      // Optimistically add the group to the UI
      setGroups(prev => [...prev, newGroup]);
      
      // Close the dialog and show success message
      handleCloseDialog();
      setSuccess('Group created successfully');

      // Make API call to persist the group
      const response = await fetch('http://localhost:5000/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const savedGroup = await response.json();
      
      // Update the group in state with the server response
      setGroups(prev => prev.map(group => 
        group._id === newGroup._id ? savedGroup : group
      ));

    } catch (err) {
      // If there's an error, remove the optimistically added group
      setGroups(prev => prev.filter(group => group._id !== formData._id));
      setError('Failed to create group. Please try again.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    
    if (!selectedGroup) return;

    try {
      // Validate required fields
      if (!formData.name || !formData.type) {
        setError('Please fill in all required fields');
        return;
      }

      // Create updated group object
      const updatedGroup = {
        ...selectedGroup,
        ...formData,
        members: formData.members.filter(member => member.trim() !== ''),
        updatedAt: new Date().toISOString()
      };

      // Optimistically update the UI
      setGroups(prev => prev.map(group => 
        group._id === selectedGroup._id ? updatedGroup : group
      ));

      // Close dialog and show success message
      handleCloseEditDialog();
      setSuccess('Group updated successfully');

      // Make API call to update the group
      const response = await fetch(`http://localhost:5000/api/groups/${selectedGroup._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGroup),
      });

      if (!response.ok) {
        throw new Error('Failed to update group');
      }

      const savedGroup = await response.json();
      
      // Update state with server response
      setGroups(prev => prev.map(group => 
        group._id === savedGroup._id ? savedGroup : group
      ));

    } catch (err) {
      // Revert changes on error
      setGroups(prev => prev.map(group => 
        group._id === selectedGroup._id ? selectedGroup : group
      ));
      setError('Failed to update group. Please try again.');
    }
  };

  const handleDelete = async (groupId) => {
    try {
      // Store group for potential rollback
      const groupToDelete = groups.find(g => g._id === groupId);
      
      // Optimistically remove from UI
      setGroups(prev => prev.filter(g => g._id !== groupId));
      setSuccess('Group deleted successfully');

      // Make API call to delete the group
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete group');
      }

    } catch (err) {
      // Restore group on error
      const groupToDelete = groups.find(g => g._id === groupId);
      if (groupToDelete) {
        setGroups(prev => [...prev, groupToDelete]);
      }
      setError('Failed to delete group. Please try again.');
    }
  };

  const calculateGroupStats = (group) => {
    const expensesByCategory = {};
    expenseCategories.forEach(category => {
      expensesByCategory[category.id] = 0;
    });

    group.expenses?.forEach(expense => {
      expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + parseFloat(expense.amount);
    });

    const totalExpenses = group.expenses?.reduce((sum, expense) => sum + parseFloat(expense.amount), 0) || 0;
    const memberCount = group.members?.length || 0;
    const averageExpense = memberCount > 0 ? totalExpenses / memberCount : 0;

    return {
      totalExpenses,
      memberCount,
      averageExpense,
      expensesByCategory
    };
  };

  const handleReceiptUpload = async (file) => {
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('receipt', file);

      // Add file validation
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        throw new Error('Please upload an image (JPG, PNG) or PDF file');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size should be less than 5MB');
      }

      // Show loading state
      setIsUploading(true);

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload receipt');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const ReceiptDisplay = ({ url }) => {
    if (!url) return null;

    const isImage = url.match(/\.(jpg|jpeg|png|gif)$/i);
    const isPDF = url.match(/\.pdf$/i);

  return (
      <Box sx={{
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        maxWidth: '300px',
        margin: '0 auto'
      }}>
        {isImage ? (
          <Box sx={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
            <img
              src={url}
              alt="Receipt"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
        ) : isPDF ? (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 2,
            backgroundColor: 'var(--card-bg-light)'
          }}>
            <PictureAsPdfIcon color="error" />
            <Typography>PDF Receipt</Typography>
          </Box>
        ) : null}
      </Box>
    );
  };

  const FileUploadInput = ({ onFileSelect }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        const url = await handleReceiptUpload(file);
        if (url) onFileSelect(url);
      }
    };

    const handleChange = async (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const url = await handleReceiptUpload(file);
        if (url) onFileSelect(url);
      }
    };

    return (
      <Box
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{ 
          border: '1px dashed var(--border-color)',
          borderRadius: '8px',
          p: 3,
          textAlign: 'center',
          backgroundColor: dragActive ? 'var(--hover-bg)' : 'var(--input-bg)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: 'var(--accent-color)',
            backgroundColor: 'var(--hover-bg)'
          }
        }}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleChange}
          style={{ display: 'none' }}
          id="receipt-upload"
        />
        <label htmlFor="receipt-upload" style={{ cursor: 'pointer' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 1 
          }}>
            {isUploading ? (
              <CircularProgress size={32} sx={{ color: 'var(--accent-color)' }} />
            ) : (
              <UploadIcon sx={{ 
                fontSize: 32,
                color: 'var(--accent-color)',
                mb: 1
              }} />
            )}
            <Typography variant="h6" sx={{ 
              color: 'var(--text-primary)',
              fontSize: '18px',
              fontWeight: 500
            }}>
              {isUploading ? 'Uploading...' : 'Upload Receipt'}
            </Typography>
            <Typography sx={{ 
              color: 'var(--text-secondary)',
              fontSize: '14px'
            }}>
              Click to upload or drag and drop
            </Typography>
            <Typography sx={{ 
              color: 'var(--text-secondary)',
              fontSize: '12px',
              opacity: 0.7,
              mt: 1
            }}>
              Supported formats: JPG, PNG, PDF (max 5MB)
            </Typography>
          </Box>
        </label>
      </Box>
    );
  };

  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleExpenseFormChange = useCallback((field, value) => {
    setExpenseForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const AddExpenseForm = () => {
    const { isDarkMode } = useTheme();
    const [formState, setFormState] = useState({
      title: '',
      amount: '',
      category: '',
      paidBy: '',
      splitType: 'equal',
      receiptUrl: null
    });

    const handleInputChange = (field, value) => {
      setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
      if (!formState.title || !formState.amount || !formState.category || !formState.paidBy) {
        setError('Please fill in all required fields');
        return;
      }

      const newExpense = {
        ...formState,
        id: Date.now(),
        date: new Date().toISOString(),
        splits: formState.splitType === 'equal' 
          ? formData.members.reduce((acc, member) => ({
              ...acc,
              [member]: (parseFloat(formState.amount) / formData.members.length).toFixed(2)
            }), {})
          : customSplits
      };

      handleAddExpense(newExpense);
      setOpenExpenseDialog(false);
      setSuccess('Expense added successfully');
    };

    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.match('image.*') && file.type !== 'application/pdf') {
        setError('Please upload an image or PDF file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('receipt', file);

        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Failed to upload receipt');

        const data = await response.json();
        handleInputChange('receiptUrl', data.url);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <Box sx={{ 
        p: 4,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: isDarkMode ? '#1a1f2e' : '#ffffff',
        borderRadius: '24px'
      }}>
        <Typography variant="h4" sx={{ 
          mb: 4, 
          color: isDarkMode ? '#e2e8f0' : '#1a1f2e',
          fontWeight: 600,
          fontSize: '28px'
        }}>
          Add New Expense
        </Typography>

        <Grid container spacing={4}>
          {/* Title and Amount Row */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 1 }}>
                  <Typography sx={{ 
                    mb: 1.5, 
                    color: isDarkMode ? '#e2e8f0' : '#1e293b',
                    fontSize: '16px',
                    fontWeight: 500 
                  }}>
                    Expense Title
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="What's this expense for?"
                    value={formState.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    InputProps={{
                      sx: {
                        height: '56px',
                        backgroundColor: isDarkMode ? '#111827' : '#f8fafc',
                        borderRadius: '12px',
                        fontSize: '16px',
                        '&:hover': {
                          backgroundColor: isDarkMode ? '#1f2937' : '#f1f5f9'
                        }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent'
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'transparent'
                        }
                      },
                      '& .MuiInputBase-input': {
                        color: isDarkMode ? '#e2e8f0' : '#1e293b',
                        '&::placeholder': {
                          color: isDarkMode ? '#64748b' : '#94a3b8',
                          opacity: 1
                        }
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 1 }}>
                  <Typography sx={{ 
                    mb: 1.5, 
                    color: isDarkMode ? '#e2e8f0' : '#1e293b',
                    fontSize: '16px',
                    fontWeight: 500 
                  }}>
                    Amount
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="0.00"
                    type="number"
                    value={formState.amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (Number(value) >= 0 && value.length <= 10)) {
                        handleInputChange('amount', value);
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography sx={{ 
                            color: isDarkMode ? '#64748b' : '#94a3b8',
                            fontSize: '16px',
                            fontWeight: 500,
                            ml: 1
                          }}>
                            $
                          </Typography>
                        </InputAdornment>
                      ),
                      sx: {
                        height: '56px',
                        backgroundColor: isDarkMode ? '#111827' : '#f8fafc',
                        borderRadius: '12px',
                        fontSize: '16px',
                        '&:hover': {
                          backgroundColor: isDarkMode ? '#1f2937' : '#f1f5f9'
                        }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent'
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'transparent'
                        }
                      },
                      '& .MuiInputBase-input': {
                        color: isDarkMode ? '#e2e8f0' : '#1e293b',
                        '&::placeholder': {
                          color: isDarkMode ? '#64748b' : '#94a3b8',
                          opacity: 1
                        }
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Category, Paid By, and Split Type Row */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 1 }}>
                  <Typography sx={{ 
                    mb: 1.5, 
                    color: isDarkMode ? '#e2e8f0' : '#1e293b',
                    fontSize: '16px',
                    fontWeight: 500 
                  }}>
                    Category
                  </Typography>
                  <Select
                    fullWidth
                    displayEmpty
                    value={formState.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    renderValue={(selected) => (
                      <Typography sx={{ 
                        color: selected ? (isDarkMode ? '#e2e8f0' : '#1e293b') : (isDarkMode ? '#64748b' : '#94a3b8'),
                        fontSize: '16px'
                      }}>
                        {selected ? expenseCategories.find(cat => cat.id === selected)?.name : 'Select Category'}
                      </Typography>
                    )}
                    sx={{
                      height: '56px',
                      backgroundColor: isDarkMode ? '#111827' : '#f8fafc',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent'
                      },
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#1f2937' : '#f1f5f9',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent'
                        }
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent'
                      },
                      '& .MuiSelect-icon': {
                        color: isDarkMode ? '#64748b' : '#94a3b8'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: isDarkMode ? '#1a1f2e' : '#ffffff',
                          backgroundImage: 'none',
                          border: `1px solid ${isDarkMode ? '#374151' : '#e2e8f0'}`,
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                          '& .MuiMenuItem-root': {
                            color: isDarkMode ? '#e2e8f0' : '#1e293b',
                            '&:hover': {
                              backgroundColor: isDarkMode ? '#1f2937' : '#f1f5f9'
                            },
                            '&.Mui-selected': {
                              backgroundColor: isDarkMode ? '#374151' : '#e2e8f0',
                              '&:hover': {
                                backgroundColor: isDarkMode ? '#4b5563' : '#cbd5e1'
                              }
                            }
                          }
                        }
                      }
                    }}
                  >
                    {expenseCategories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                            p: 0.75,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            {category.icon}
                          </Box>
                          <Typography sx={{ 
                            color: isDarkMode ? '#e2e8f0' : '#1e293b',
                            fontSize: '15px'
                          }}>
                            {category.name}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 1 }}>
                  <Typography sx={{ 
                    mb: 1.5, 
                    color: isDarkMode ? '#e2e8f0' : '#1e293b',
                    fontSize: '16px',
                    fontWeight: 500 
                  }}>
                    Paid By
                  </Typography>
                  <Select
                    fullWidth
                    displayEmpty
                    value={formState.paidBy}
                    onChange={(e) => handleInputChange('paidBy', e.target.value)}
                    renderValue={(selected) => (
                      <Typography sx={{ 
                        color: selected ? (isDarkMode ? '#e2e8f0' : '#1e293b') : (isDarkMode ? '#64748b' : '#94a3b8'),
                        fontSize: '16px'
                      }}>
                        {selected || 'Select Payer'}
                      </Typography>
                    )}
                    sx={{
                      height: '56px',
                      backgroundColor: isDarkMode ? '#111827' : '#f8fafc',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent'
                      },
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#1f2937' : '#f1f5f9',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent'
                        }
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent'
                      },
                      '& .MuiSelect-icon': {
                        color: isDarkMode ? '#64748b' : '#94a3b8'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: isDarkMode ? '#1a1f2e' : '#ffffff',
                          backgroundImage: 'none',
                          border: `1px solid ${isDarkMode ? '#374151' : '#e2e8f0'}`,
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                          '& .MuiMenuItem-root': {
                            color: isDarkMode ? '#e2e8f0' : '#1e293b',
                            '&:hover': {
                              backgroundColor: isDarkMode ? '#1f2937' : '#f1f5f9'
                            },
                            '&.Mui-selected': {
                              backgroundColor: isDarkMode ? '#374151' : '#e2e8f0',
                              '&:hover': {
                                backgroundColor: isDarkMode ? '#4b5563' : '#cbd5e1'
                              }
                            }
                          }
                        }
                      }
                    }}
                  >
                    {formData.members.map((member, index) => (
                      <MenuItem key={member} value={member}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ 
                            width: 28, 
                            height: 28, 
                            fontSize: '13px',
                            bgcolor: `hsl(${index * 60}, 70%, 60%)`
                          }}>
                            {member.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography sx={{ 
                            color: isDarkMode ? '#e2e8f0' : '#1e293b',
                            fontSize: '15px'
                          }}>
                            {member}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 1 }}>
                  <Typography sx={{ 
                    mb: 1.5, 
                    color: isDarkMode ? '#e2e8f0' : '#1e293b',
                    fontSize: '16px',
                    fontWeight: 500 
                  }}>
                    Split Type
                  </Typography>
                  <Select
                    fullWidth
                    value={formState.splitType}
                    onChange={(e) => handleInputChange('splitType', e.target.value)}
                    sx={{
                      height: '56px',
                      backgroundColor: isDarkMode ? '#111827' : '#f8fafc',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent'
                      },
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#1f2937' : '#f1f5f9',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent'
                        }
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent'
                      },
                      '& .MuiSelect-icon': {
                        color: isDarkMode ? '#64748b' : '#94a3b8'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: isDarkMode ? '#1a1f2e' : '#ffffff',
                          backgroundImage: 'none',
                          border: `1px solid ${isDarkMode ? '#374151' : '#e2e8f0'}`,
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                          '& .MuiMenuItem-root': {
                            color: isDarkMode ? '#e2e8f0' : '#1e293b',
                            '&:hover': {
                              backgroundColor: isDarkMode ? '#1f2937' : '#f1f5f9'
                            },
                            '&.Mui-selected': {
                              backgroundColor: isDarkMode ? '#374151' : '#e2e8f0',
                              '&:hover': {
                                backgroundColor: isDarkMode ? '#4b5563' : '#cbd5e1'
                              }
                            }
                          }
                        }
                      }
                    }}
                  >
                    {splitTypes.map(type => (
                      <MenuItem key={type.id} value={type.id}>
                        <Typography sx={{ 
                          color: isDarkMode ? '#e2e8f0' : '#1e293b',
                          fontSize: '15px'
                        }}>
                          {type.name}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Receipt Upload */}
          <Grid item xs={12}>
            <Box
              sx={{
                border: `2px dashed ${isDarkMode ? '#374151' : '#e2e8f0'}`,
                borderRadius: '16px',
                p: 4,
                textAlign: 'center',
                backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#6366f1',
                  backgroundColor: isDarkMode ? '#1f2937' : '#f8fafc'
                }
              }}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" style={{ cursor: 'pointer' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  {isUploading ? (
                    <CircularProgress size={40} sx={{ color: '#6366f1' }} />
                  ) : (
                    <UploadIcon sx={{ fontSize: 40, color: '#6366f1' }} />
                  )}
                  <Typography sx={{ 
                    color: isDarkMode ? '#e2e8f0' : '#1e293b', 
                    fontSize: '18px', 
                    fontWeight: 500 
                  }}>
                    Upload Receipt
                  </Typography>
                  <Typography sx={{ 
                    color: isDarkMode ? '#64748b' : '#64748b', 
                    fontSize: '14px' 
                  }}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography sx={{ 
                    color: isDarkMode ? '#64748b' : '#64748b', 
                    fontSize: '12px' 
                  }}>
                    Supported formats: JPG, PNG, PDF (max 5MB)
                  </Typography>
                </Box>
              </label>
            </Box>
            {formState.receiptUrl && (
              <Box sx={{ mt: 2 }}>
                <ReceiptDisplay url={formState.receiptUrl} />
              </Box>
            )}
          </Grid>

          {/* Add Button */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={!formState.title || !formState.amount || !formState.category || !formState.paidBy}
              startIcon={<AddIcon />}
              sx={{
                height: '48px',
                backgroundColor: '#6366f1',
                borderRadius: '12px',
                fontSize: '16px',
                textTransform: 'none',
                color: '#ffffff',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#4f46e5'
                },
                '&.Mui-disabled': {
                  backgroundColor: isDarkMode ? '#1f2937' : '#e2e8f0',
                  color: isDarkMode ? '#4b5563' : '#94a3b8'
                }
              }}
            >
              Add Expense
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const MemoizedAddExpenseForm = useMemo(() => <AddExpenseForm />, [expenseForm, formData.members]);

  const GroupCard = ({ group, onEdit, onDelete }) => {
          const stats = calculateGroupStats(group);
    const groupType = groupTypes.find(type => type.id === group.type);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

          return (
      <div className="member-card">
              <div className="member-info">
          <div className="category-icon" style={{ 
            backgroundColor: `${groupType?.color || '#6c5dd3'}20`,
            color: groupType?.color || '#6c5dd3'
          }}>
            {groupType?.icon || <RoommatesIcon />}
                </div>
                <div className="member-details">
                  <h3>{group.name}</h3>
                  <p className="member-role">{group.description}</p>
            <p className="tasks-completed">
              {group.members?.length || 0} member{group.members?.length !== 1 ? 's' : ''}
            </p>
            {group.budget && (
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                  style={{ 
                    width: `${Math.min((stats.totalExpenses / group.budget) * 100, 100)}%`,
                    backgroundColor: stats.totalExpenses > group.budget ? '#FF6B6B' : '#6c5dd3'
                  }}
                    ></div>
                  </div>
            )}
                </div>
              </div>

              <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ 
            color: 'var(--text-secondary)',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <PersonAddIcon sx={{ fontSize: 18 }} /> Members
                    </Typography>
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            minHeight: '32px'
          }}>
            {group.members?.length > 0 ? (
              group.members.map((member, index) => (
                        <Chip
                          key={index}
                  avatar={
                    <Avatar sx={{ bgcolor: `hsl(${index * 60}, 70%, 60%)` }}>
                      {member.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                          label={member}
                          sx={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                    '& .MuiChip-avatar': {
                      color: '#fff',
                      fontWeight: 500
                    }
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" sx={{ 
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}>
                No members added yet
              </Typography>
            )}
                    </Box>
                  </Box>

              <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ 
            color: 'var(--text-secondary)',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <MoneyIcon sx={{ fontSize: 18 }} /> Expense Categories
                </Typography>
          {stats.totalExpenses > 0 ? (
                <Grid container spacing={1}>
                  {expenseCategories.map(category => {
                    const amount = stats.expensesByCategory[category.id];
                    if (amount > 0) {
                      return (
                        <Grid item xs={4} key={category.id}>
                  <Box sx={{ 
                    display: 'flex', 
                            alignItems: 'center',
                            gap: 1,
                            p: 1,
                            backgroundColor: category.color + '20',
                            borderRadius: '8px',
                          }}>
                            <Box sx={{
                              color: category.color,
                              display: 'flex',
                              alignItems: 'center',
                            }}>
                              {category.icon}
                    </Box>
                    <Box>
                              <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                                {category.name}
                      </Typography>
                              <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                                ${amount.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                        </Grid>
                      );
                    }
                    return null;
                  })}
            </Grid>
          ) : (
            <Typography variant="body2" sx={{ 
              color: 'var(--text-secondary)',
              fontStyle: 'italic'
            }}>
              No expenses added yet
            </Typography>
          )}
              </Box>

              <div className="member-stats">
                <div>
                  <span className="amount">${stats.totalExpenses.toFixed(2)}</span>
                  <span className="period">Total Expenses</span>
                </div>
                <div>
            <span className="amount">
              ${group.members?.length ? (stats.totalExpenses / group.members.length).toFixed(2) : '0.00'}
            </span>
                  <span className="period">Avg/Member</span>
                </div>
                <div className="actions">
                  <MuiTooltip title="Edit group">
                    <IconButton 
                onClick={() => onEdit(group)}
                sx={{ 
                  color: 'var(--accent-color)',
                  '&:hover': {
                    backgroundColor: 'var(--accent-color-light)'
                  }
                }}
                    >
                      <EditIcon />
                    </IconButton>
                  </MuiTooltip>
                  <MuiTooltip title="Delete group">
                    <IconButton 
                onClick={() => setDeleteConfirmOpen(true)}
                sx={{ 
                  color: 'var(--error-color)',
                  '&:hover': {
                    backgroundColor: 'var(--error-light)'
                  }
                }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </MuiTooltip>
                </div>
              </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: 'var(--card-bg)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)'
            }
          }}
        >
          <DialogTitle sx={{ color: 'var(--text-primary)' }}>
            Delete Group?
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete "{group.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setDeleteConfirmOpen(false)}
              sx={{ color: 'var(--text-secondary)' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                onDelete(group._id);
                setDeleteConfirmOpen(false);
              }}
              variant="contained"
              color="error"
              sx={{
                backgroundColor: 'var(--error-color)',
                '&:hover': {
                  backgroundColor: 'var(--error-dark)'
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
            </div>
          );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Groups</h1>
          <span className="premium-badge">★ PREMIUM</span>
        </div>
        <div className="date-info">
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
          <div className="search-box">
            <input type="text" placeholder="Search groups..." />
          </div>
        </div>
      </div>

      <div className="team-members-grid">
        {groups.map(group => (
          <GroupCard 
            key={group._id} 
            group={group} 
            onEdit={handleOpenEditDialog}
            onDelete={handleDelete}
          />
        ))}

        {/* Add New Group Card */}
        <div className="member-card" 
          onClick={handleOpenDialog}
          style={{ 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            border: '2px dashed var(--border-color)',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'var(--accent-color)',
              backgroundColor: 'var(--hover-bg)'
            }
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div className="category-icon" style={{ 
              margin: '0 auto 1rem auto',
              backgroundColor: 'var(--accent-color-light)',
              color: 'var(--accent-color)'
            }}>
              <AddIcon />
            </div>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>
              Create New Group
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              Click to add a new expense group
            </Typography>
          </div>
        </div>
      </div>

      {/* Add/Edit Group Dialog */}
      <Dialog 
        open={openDialog || editDialog} 
        onClose={editDialog ? handleCloseEditDialog : handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'var(--card-bg)',
            borderRadius: '24px',
            padding: '24px',
            minHeight: '60vh',
            border: '1px solid var(--border-color)',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'var(--text-primary)',
          fontSize: '28px',
          fontWeight: 600,
          padding: '0 0 24px 0',
        }}>
          {editDialog ? 'Edit Group' : 'Create New Group'}
        </DialogTitle>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            mb: 4,
            borderBottom: '1px solid var(--border-color)',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              '&.Mui-selected': {
                color: 'var(--accent-color)',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--accent-color)',
              height: '3px',
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab label="BASIC INFO" />
          <Tab label="MEMBERS" />
          <Tab label="EXPENSES" />
        </Tabs>

        <DialogContent sx={{ padding: 0 }}>
          {activeTab === 0 && (
            <Box>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ 
                  color: 'var(--text-secondary)',
                  '&.Mui-focused': {
                    color: 'var(--accent-color)',
                  }
                }}>
                  Type of Group
                </InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => {
                    const selectedType = groupTypes.find(type => type.id === e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      type: e.target.value,
                      startDate: selectedType?.requiresDates ? prev.startDate : '',
                      endDate: selectedType?.requiresDates ? prev.endDate : '',
                      budget: selectedType?.requiresBudget ? prev.budget : ''
                    }));
                  }}
                  sx={{
                    backgroundColor: 'var(--input-bg)',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-color)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-hover)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--accent-color)',
                    },
                    '& .MuiSelect-select': {
                      color: 'var(--text-primary)',
                    }
                  }}
                >
                  {groupTypes.map(type => (
                    <MenuItem 
                      key={type.id} 
                      value={type.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        color: 'var(--text-primary)',
                        '&:hover': {
                          backgroundColor: 'var(--hover-bg)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'var(--selected-bg)',
                          '&:hover': {
                            backgroundColor: 'var(--selected-hover-bg)',
                          }
                        }
                      }}
                    >
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        backgroundColor: 'var(--accent-color-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-color)',
                      }}>
                        {type.icon}
                      </Box>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

          <TextField
            fullWidth
            label="Group Name"
            value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--input-bg)',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'var(--border-color)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--border-hover)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--accent-color)',
                    },
                    '& input': {
                      color: 'var(--text-primary)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--text-secondary)',
                    '&.Mui-focused': {
                      color: 'var(--accent-color)',
                    }
                  }
                }}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                multiline
                rows={3}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--input-bg)',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'var(--border-color)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--border-hover)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--accent-color)',
                    },
                    '& textarea': {
                      color: 'var(--text-primary)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--text-secondary)',
                    '&.Mui-focused': {
                      color: 'var(--accent-color)',
                    }
                  }
                }}
              />

              {formData.type && groupTypes.find(type => type.id === formData.type)?.requiresDates && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                      label="Start Date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleFormChange('startDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                          backgroundColor: 'var(--input-bg)',
                        borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'var(--border-color)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--border-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--accent-color)',
                          },
                          '& input': {
                            color: 'var(--text-primary)',
                            '&::-webkit-calendar-picker-indicator': {
                              filter: 'var(--calendar-icon-filter)',
                            }
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--text-secondary)',
                          '&.Mui-focused': {
                            color: 'var(--accent-color)',
                          }
                        }
                      }}
                    />
                  </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                      label="End Date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleFormChange('endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                          backgroundColor: 'var(--input-bg)',
                        borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'var(--border-color)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--border-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--accent-color)',
                          },
                          '& input': {
                            color: 'var(--text-primary)',
                            '&::-webkit-calendar-picker-indicator': {
                              filter: 'var(--calendar-icon-filter)',
                            }
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--text-secondary)',
                          '&.Mui-focused': {
                            color: 'var(--accent-color)',
                          }
                      }
                    }}
                  />
                </Grid>
                </Grid>
              )}

              {formData.type && groupTypes.find(type => type.id === formData.type)?.requiresBudget && (
                  <TextField
                    fullWidth
                  label="Budget"
                    type="number"
                  value={formData.budget}
                  onChange={(e) => handleFormChange('budget', e.target.value)}
                    InputProps={{
                      startAdornment: (
                      <InputAdornment position="start" sx={{ color: 'var(--text-secondary)' }}>
                          $
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--input-bg)',
                        borderRadius: '12px',
                      '& fieldset': {
                        borderColor: 'var(--border-color)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'var(--border-hover)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'var(--accent-color)',
                      },
                      '& input': {
                        color: 'var(--text-primary)',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'var(--text-secondary)',
                      '&.Mui-focused': {
                        color: 'var(--accent-color)',
                      }
                      }
                    }}
                  />
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {formData.members.map((member, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 2,
                  alignItems: 'center'
                }}>
                  <Avatar 
                      sx={{
                      bgcolor: `hsl(${index * 60}, 70%, 60%)`,
                      color: 'white'
                    }}
                  >
                    {member ? member.charAt(0).toUpperCase() : '?'}
                  </Avatar>
                  <TextField
                    fullWidth
                    placeholder="Enter member name"
                    value={member}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'var(--input-bg)',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: 'var(--border-color)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--border-hover)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--accent-color)',
                        },
                        '& input': {
                          color: 'var(--text-primary)',
                        }
                      }
                    }}
                  />
                  <IconButton 
                    onClick={() => handleRemoveMember(index)}
                      sx={{
                      backgroundColor: 'var(--error-light)',
                      color: 'var(--error-color)',
                        borderRadius: '12px',
                      '&:hover': {
                        backgroundColor: 'var(--error-hover)',
                      }
                    }}
                  >
                    <PersonRemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<PersonAddIcon />}
                onClick={handleAddMember}
                      sx={{
                  color: 'var(--accent-color)',
                  backgroundColor: 'var(--accent-color-light)',
                        borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  padding: '10px 20px',
                  '&:hover': {
                    backgroundColor: 'var(--accent-color-hover)',
                  }
                }}
              >
                Add Member
              </Button>
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ mt: 2 }}>
              {/* Add Expense Button */}
          <Button 
                    variant="contained"
                    startIcon={<AddIcon />}
                onClick={() => setOpenExpenseDialog(true)}
            sx={{
                  backgroundColor: 'var(--accent-color)',
                      color: '#FFFFFF',
                  borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '16px',
                      fontWeight: 500,
                  padding: '12px 24px',
                  mb: 3,
              '&:hover': {
                    backgroundColor: 'var(--accent-color-dark)'
              }
            }}
          >
                Add New Expense
          </Button>

              {/* Expense List */}
              <List sx={{ 
                backgroundColor: 'var(--card-bg)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)'
              }}>
                {formData.expenses.map((expense, index) => {
                  const category = expenseCategories.find(cat => cat.id === expense.category);
                  return (
                    <React.Fragment key={expense.id}>
                      <ListItem
                        sx={{
                          py: 2,
                          '&:hover': {
                            backgroundColor: 'var(--hover-bg)',
                          }
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveExpense(expense.id)}
                            sx={{
                              color: 'var(--error-color)',
                              backgroundColor: 'var(--error-light)',
                              borderRadius: '8px',
                              '&:hover': {
                                backgroundColor: 'var(--error-hover)',
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{
                                backgroundColor: category?.color + '20',
                                color: category?.color,
                                p: 1,
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                              }}>
                                {category?.icon}
                              </Box>
                              <Box>
                                <Typography sx={{ 
                                  fontWeight: 500,
                                  color: 'var(--text-primary)',
                                  fontSize: '16px'
                                }}>
                                {expense.title}
                              </Typography>
                                <Typography sx={{ 
                                  color: 'var(--text-secondary)',
                                  fontSize: '14px',
                                  mt: 0.5
                                }}>
                              ${parseFloat(expense.amount).toFixed(2)} • Paid by {expense.paidBy}
                            </Typography>
                                {expense.splitType !== 'equal' && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography sx={{ 
                                      color: 'var(--text-secondary)',
                                      fontSize: '14px',
                                      fontStyle: 'italic'
                                    }}>
                                      Split: {expense.splitType === 'percentage' ? 'By Percentage' : 'Custom Amount'}
                                    </Typography>
                                    {Object.entries(expense.splits).map(([member, amount]) => (
                                      <Typography key={member} sx={{ 
                                        color: 'var(--text-secondary)',
                                        fontSize: '12px'
                                      }}>
                                        {member}: {expense.splitType === 'percentage' ? `${amount}%` : `$${parseFloat(amount).toFixed(2)}`}
                                      </Typography>
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          }
                        />
                        {expense.receiptUrl && (
                          <Box sx={{ ml: 2 }}>
                            <MuiTooltip title="View Receipt">
                              <IconButton
                                onClick={() => window.open(expense.receiptUrl, '_blank')}
                                sx={{
                                  color: 'var(--accent-color)',
                                  backgroundColor: 'var(--accent-color-light)',
                                  '&:hover': {
                                    backgroundColor: 'var(--accent-color-hover)'
                                  }
                                }}
                              >
                                {expense.receiptUrl.endsWith('.pdf') ? <PictureAsPdfIcon /> : <UploadIcon />}
                              </IconButton>
                            </MuiTooltip>
                          </Box>
                        )}
                      </ListItem>
                      {index < formData.expenses.length - 1 && (
                        <Divider sx={{ borderColor: 'var(--border-color)' }} />
                      )}
                    </React.Fragment>
                  );
                })}
                {formData.expenses.length === 0 && (
                  <ListItem sx={{ py: 4 }}>
                    <ListItemText
                      sx={{ 
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        '& .MuiTypography-root': {
                          fontSize: '16px',
                          fontStyle: 'italic'
                        }
                      }}
                      primary="No expenses added yet"
                    />
                  </ListItem>
                )}
              </List>
              </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ padding: '24px 0 0 0' }}>
          <Button 
            onClick={editDialog ? handleCloseEditDialog : handleCloseDialog}
            sx={{
              color: 'var(--text-secondary)',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'var(--hover-bg)',
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={editDialog ? handleEdit : handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: 'var(--accent-color)',
              color: '#FFFFFF',
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              padding: '10px 24px',
              '&:hover': {
                backgroundColor: 'var(--accent-color-dark)',
              }
            }}
          >
            {editDialog ? 'Update Group' : 'Create Group'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Expense Dialog */}
      <Dialog
        open={openExpenseDialog}
        onClose={() => setOpenExpenseDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? '#1a1f2e' : '#ffffff',
            borderRadius: '24px',
            border: `1px solid ${isDarkMode ? '#374151' : '#e2e8f0'}`,
            position: 'relative',
            overflow: 'hidden'
          }
        }}
      >
        <IconButton
          onClick={() => setOpenExpenseDialog(false)}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: isDarkMode ? '#94a3b8' : '#64748b',
            backgroundColor: isDarkMode ? '#111827' : '#f1f5f9',
            '&:hover': {
              backgroundColor: isDarkMode ? '#1f2937' : '#e2e8f0',
            },
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0 }}>
          {MemoizedAddExpenseForm}
        </DialogContent>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity="error" 
          sx={{ 
            width: '100%',
            borderRadius: '12px',
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: '12px',
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GroupsComponent; 