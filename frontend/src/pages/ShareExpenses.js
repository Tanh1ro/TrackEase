/**
 * @file ShareExpenses.js
 * @description Component for managing shared expenses in the application
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 * 
 * This component allows users to:
 * 1. View all shared expenses
 * 2. Add new expenses either by scanning receipts or manual entry
 * 3. Categorize expenses and associate them with groups
 * 4. View expense history in a tabular format
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  CameraAlt as CameraIcon,
  FileUpload as UploadIcon,
} from '@mui/icons-material';
import '../css/Dashboard.css';

const ShareExpenses = () => {
  const { colors, typography, spacing, borderRadius, shadows, theme } = useTheme();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0 for personal, 1 for group
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [entryMethod, setEntryMethod] = useState('manual');
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'personal'
  });
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: 'Dinner with Friends',
      amount: 120.00,
      category: 'Food & Dining',
      date: '2024-03-15',
      sharedWith: ['John', 'Sarah', 'Mike'],
      paidBy: 'You',
      trend: 'up',
      icon: '🍽️',
      type: 'group'
    },
    {
      id: 2,
      title: 'Movie Tickets',
      amount: 45.00,
      category: 'Entertainment',
      date: '2024-03-14',
      sharedWith: ['John', 'Sarah'],
      paidBy: 'John',
      trend: 'down',
      icon: '🎬',
      type: 'group'
    },
    {
      id: 3,
      title: 'Grocery Shopping',
      amount: 85.50,
      category: 'Groceries',
      date: '2024-03-13',
      paidBy: 'You',
      trend: 'up',
      icon: '🛒',
      type: 'personal'
    },
  ]);

  const handleAddExpense = () => {
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setEntryMethod('manual');
    setNewExpense({
      title: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      type: 'personal'
    });
  };

  const handleSubmitExpense = () => {
    if (entryMethod === 'manual') {
      if (!newExpense.title || !newExpense.amount || !newExpense.category) {
        setError('Please fill in all required fields');
        return;
      }

      const expense = {
        id: expenses.length + 1,
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        sharedWith: [],
        paidBy: 'You',
        trend: 'up',
        icon: '💰'
      };

      setExpenses(prev => [...prev, expense]);
    setSuccess('Expense added successfully');
    } else {
      // TODO: Implement receipt scanning functionality
      setSuccess('Receipt scanning feature coming soon!');
    }
    handleCloseDialog();
  };

  const handleEditExpense = (id) => {
    // TODO: Implement edit expense functionality
    setSuccess('Expense updated successfully');
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    setSuccess('Expense deleted successfully');
  };

  const filteredExpenses = expenses.filter(expense => {
    if (activeTab === 0) {
      return expense.type === 'personal';
    } else {
      return expense.type === 'group';
    }
  });

  const formFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(30, 34, 40, 0.5)',
      borderRadius: '12px',
      height: '56px',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&:hover fieldset': {
        borderColor: colors.primary,
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.primary,
      },
    },
    '& .MuiInputLabel-root': {
      color: theme === 'light' ? '#24292e' : 'rgba(255, 255, 255, 0.5)',
      '&.Mui-focused': {
        color: colors.primary,
      },
    },
    '& .MuiInputBase-input': {
      color: theme === 'light' ? '#24292e' : '#fff',
      fontSize: '1rem',
      '&::placeholder': {
        color: theme === 'light' ? '#586069' : 'rgba(255, 255, 255, 0.5)',
        opacity: 1,
      },
    },
    '& .MuiInputAdornment-root': {
      color: theme === 'light' ? '#586069' : 'rgba(255, 255, 255, 0.5)',
    },
    marginBottom: '16px',
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Expenses</h1>
          <span className="premium-badge">★ PREMIUM</span>
        </div>
        <div className="date-info">
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
          <div className="search-box">
            <input type="text" placeholder="Search expenses..." />
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddExpense}
            sx={{
              backgroundColor: colors.primary,
              color: '#fff',
              '&:hover': {
                backgroundColor: colors.primaryDark,
              },
              ml: 2,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Add Expense
          </Button>
        </div>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: colors.text,
              '&.Mui-selected': {
                color: colors.primary,
              },
            },
          }}
        >
          <Tab label="Personal Expenses" />
          <Tab label="Group Expenses" />
        </Tabs>
      </Box>

      <div className="team-members-grid">
        {filteredExpenses && filteredExpenses.length > 0 ? (
          filteredExpenses.map(expense => (
            <div key={expense.id} className="member-card">
              <div className="member-info">
                <div className="category-icon">{expense.icon}</div>
                <div className="member-details">
                  <h3>{expense.title}</h3>
                  <p className="member-role">{expense.category}</p>
                  <p className="tasks-completed">Paid by {expense.paidBy}</p>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
              <div className="member-stats">
                <span className={`amount ${expense.trend}`}>
                  ${expense.amount.toFixed(2)}
                </span>
                <span className="period">{expense.date}</span>
                <span className={`trend-indicator ${expense.trend}`}>
                  {expense.trend === 'up' ? '↗' : '↘'}
                </span>
              </div>
              {expense.type === 'group' && (
                <div className="shared-with">
                  <p className="member-role">Shared With:</p>
                  <div className="chips-container">
                    {expense.sharedWith.map((person, index) => (
                      <Chip
                        key={index}
                        label={person}
                        size="small"
                        sx={{
                          backgroundColor: colors.backgroundLight,
                          color: colors.text,
                          margin: '0.25rem',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="actions">
                <IconButton 
                  onClick={() => handleEditExpense(expense.id)}
                  sx={{ color: colors.primary }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleDeleteExpense(expense.id)}
                  sx={{ color: colors.error }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <Box sx={{ 
            width: '100%', 
            textAlign: 'center', 
            padding: '2rem',
            color: theme === 'light' ? '#24292e' : colors.text
          }}>
            <Typography variant="h6">
              No {activeTab === 0 ? 'personal' : 'group'} expenses found
            </Typography>
          </Box>
        )}
      </div>

      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme === 'light' ? '#fff' : '#1A1D21',
            borderRadius: '24px',
            boxShadow: theme === 'light' 
              ? '0 20px 40px rgba(0,0,0,0.1)' 
              : '0 20px 40px rgba(0,0,0,0.4)',
            maxWidth: '600px',
            margin: '16px',
            width: 'calc(100% - 32px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.75rem', 
          fontWeight: 600,
          color: theme === 'light' ? '#1a1a1a' : '#fff',
          pt: 4,
          px: 4,
          pb: 2,
          borderBottom: `1px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
        }}>
          Add New Expense
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography 
            sx={{ 
              color: theme === 'light' ? '#1a1a1a' : '#fff',
              fontSize: '1rem',
              mb: 3,
              fontWeight: 500,
              opacity: 0.9,
            }}
          >
            How would you like to add the expense?
          </Typography>
          
          <RadioGroup
            value={entryMethod}
            onChange={(e) => setEntryMethod(e.target.value)}
            row
            sx={{
              mb: 4,
              gap: 2,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <FormControlLabel 
              value="manual" 
              control={
                <Radio 
                  sx={{
                    '&.MuiRadio-root': {
                      color: theme === 'light' ? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 0.5)',
                '&.Mui-checked': {
                        color: colors.primary,
                      },
                    }
                  }}
                />
              } 
              label="Manual Entry"
              sx={{
                flex: 1,
                margin: 0,
                backgroundColor: theme === 'light' ? '#F8F9FA' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '16px',
                transition: 'all 0.2s ease',
                border: `2px solid ${entryMethod === 'manual' ? colors.primary : 'transparent'}`,
                '& .MuiFormControlLabel-label': {
                  color: theme === 'light' ? '#1a1a1a' : '#fff',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  width: '100%',
                  textAlign: 'center',
                },
                '&:hover': {
                  backgroundColor: theme === 'light' ? '#F1F3F5' : 'rgba(255, 255, 255, 0.08)',
                  transform: 'translateY(-1px)',
                },
              }}
            />
            <FormControlLabel 
              value="scan" 
              control={
                <Radio 
                  sx={{
                    '&.MuiRadio-root': {
                      color: theme === 'light' ? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 0.5)',
                      '&.Mui-checked': {
                        color: colors.primary,
                      },
                    }
                  }}
                />
              } 
              label="Scan Receipt"
              sx={{
                flex: 1,
                margin: 0,
                backgroundColor: theme === 'light' ? '#F8F9FA' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '16px',
                transition: 'all 0.2s ease',
                border: `2px solid ${entryMethod === 'scan' ? colors.primary : 'transparent'}`,
              '& .MuiFormControlLabel-label': {
                  color: theme === 'light' ? '#1a1a1a' : '#fff',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  width: '100%',
                  textAlign: 'center',
                },
                '&:hover': {
                  backgroundColor: theme === 'light' ? '#F1F3F5' : 'rgba(255, 255, 255, 0.08)',
                  transform: 'translateY(-1px)',
                },
              }}
            />
          </RadioGroup>

          {entryMethod === 'manual' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Expense Name"
                placeholder="Enter expense name"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme === 'light' ? '#F8F9FA' : 'rgba(30, 34, 40, 0.5)',
                    borderRadius: '16px',
                    height: '56px',
                    '& fieldset': {
                      borderColor: 'transparent',
                      transition: 'all 0.2s ease',
                    },
                    '&:hover fieldset': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary,
                      borderWidth: '2px',
                    },
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                    '&.Mui-focused': {
                      color: colors.primary,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: theme === 'light' ? '#1a1a1a' : '#fff',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    '&::placeholder': {
                      color: theme === 'light' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
                      opacity: 1,
                    },
                  },
                }}
              />
              <TextField
                label="Amount"
                placeholder="Enter amount"
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ 
                        color: theme === 'light' ? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 0.5)',
                        fontWeight: 500,
                      }}>
                        $
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme === 'light' ? '#F8F9FA' : 'rgba(30, 34, 40, 0.5)',
                    borderRadius: '16px',
                    height: '56px',
                    '& fieldset': {
                      borderColor: 'transparent',
                      transition: 'all 0.2s ease',
                    },
                    '&:hover fieldset': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary,
                      borderWidth: '2px',
                    },
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                    '&.Mui-focused': {
                      color: colors.primary,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: theme === 'light' ? '#1a1a1a' : '#fff',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                  },
                }}
              />
              <TextField
                select
                label="Category"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                fullWidth
                required
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: theme === 'light' ? '#fff' : '#1A1D21',
                        color: theme === 'light' ? '#1a1a1a' : '#fff',
                        borderRadius: '16px',
                        boxShadow: theme === 'light' 
                          ? '0 4px 20px rgba(0,0,0,0.1)' 
                          : '0 4px 20px rgba(0,0,0,0.3)',
                        '& .MuiMenuItem-root': {
                          fontSize: '0.95rem',
                          color: theme === 'light' ? '#1a1a1a' : '#fff',
                          padding: '12px 16px',
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: theme === 'light' ? '#F8F9FA' : 'rgba(108, 93, 211, 0.1)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: theme === 'light' ? '#EDE7FF' : 'rgba(108, 93, 211, 0.2)',
                            color: colors.primary,
                            fontWeight: 600,
                          },
                        },
                      },
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme === 'light' ? '#F8F9FA' : 'rgba(30, 34, 40, 0.5)',
                    borderRadius: '16px',
                    height: '56px',
                    '& fieldset': {
                      borderColor: 'transparent',
                      transition: 'all 0.2s ease',
                    },
                    '&:hover fieldset': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary,
                      borderWidth: '2px',
                    },
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                    '&.Mui-focused': {
                      color: colors.primary,
                    },
                  },
                  '& .MuiSelect-select': {
                    color: theme === 'light' ? '#1a1a1a' : '#fff',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                  },
                }}
              >
                {['Food & Dining', 'Shopping', 'Transportation', 'Entertainment', 'Bills & Utilities', 'Others'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Date"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme === 'light' ? '#F8F9FA' : 'rgba(30, 34, 40, 0.5)',
                    borderRadius: '16px',
                    height: '56px',
                    '& fieldset': {
                      borderColor: 'transparent',
                      transition: 'all 0.2s ease',
                    },
                    '&:hover fieldset': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary,
                      borderWidth: '2px',
                    },
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                      filter: theme === 'light' ? 'none' : 'invert(1)',
                      opacity: theme === 'light' ? 0.54 : 0.5,
                      cursor: 'pointer',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                    '&.Mui-focused': {
                      color: colors.primary,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: theme === 'light' ? '#1a1a1a' : '#fff',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 3,
              py: 4 
            }}>
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                width: '100%' 
              }}>
                  <Box 
                    sx={{ 
                    flex: 1,
                    border: `2px dashed ${theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '20px',
                      p: 4,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    backgroundColor: theme === 'light' ? '#F8F9FA' : 'rgba(30, 34, 40, 0.5)',
                      '&:hover': { 
                      backgroundColor: theme === 'light' ? '#F1F3F5' : 'rgba(30, 34, 40, 0.8)',
                      borderColor: colors.primary,
                      transform: 'translateY(-2px)',
                      },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    component="label"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setSuccess('Receipt upload feature coming soon!');
                          handleCloseDialog();
                        }
                      }}
                    />
                  <UploadIcon sx={{ fontSize: 40, color: colors.primary, mb: 2 }} />
                  <Typography variant="h6" sx={{ 
                    color: theme === 'light' ? '#1a1a1a' : '#fff',
                    mb: 1, 
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}>
                      Upload Receipt
                    </Typography>
                  <Typography variant="body2" sx={{ 
                    color: theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                    textAlign: 'center',
                    fontSize: '0.875rem'
                  }}>
                      Click or drag & drop
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                    flex: 1,
                    border: `2px dashed ${theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '20px',
                      p: 4,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    backgroundColor: theme === 'light' ? '#F8F9FA' : 'rgba(30, 34, 40, 0.5)',
                      '&:hover': { 
                      backgroundColor: theme === 'light' ? '#F1F3F5' : 'rgba(30, 34, 40, 0.8)',
                      borderColor: colors.primary,
                      transform: 'translateY(-2px)',
                      },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => {
                      setSuccess('Camera access coming soon!');
                      handleCloseDialog();
                    }}
                  >
                  <CameraIcon sx={{ fontSize: 40, color: colors.primary, mb: 2 }} />
                  <Typography variant="h6" sx={{ 
                    color: theme === 'light' ? '#1a1a1a' : '#fff',
                    mb: 1, 
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}>
                      Take Photo
                    </Typography>
                  <Typography variant="body2" sx={{ 
                    color: theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                    textAlign: 'center',
                    fontSize: '0.875rem'
                  }}>
                      Use camera to capture
                    </Typography>
                  </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: 4,
          gap: 2,
          borderTop: `1px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
        }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : '#fff',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              backgroundColor: theme === 'light' ? '#F8F9FA' : 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                backgroundColor: theme === 'light' ? '#F1F3F5' : 'rgba(255, 255, 255, 0.08)',
                transform: 'translateY(-1px)',
              }
            }}
          >
            Cancel
          </Button>
        <Button
            onClick={handleSubmitExpense}
          variant="contained"
            disabled={entryMethod === 'manual' && (!newExpense.title || !newExpense.amount || !newExpense.category)}
          sx={{
              backgroundColor: colors.primary,
              color: '#fff',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '12px',
              px: 4,
              py: 1.5,
            '&:hover': {
                backgroundColor: colors.primaryDark,
                transform: 'translateY(-1px)',
              },
              '&.Mui-disabled': {
                backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(108, 93, 211, 0.3)',
                color: theme === 'light' ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)'
            }
          }}
        >
          Add Expense
        </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ShareExpenses; 