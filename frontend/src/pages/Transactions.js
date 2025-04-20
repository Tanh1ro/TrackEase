/**
 * @file Transactions.js
 * @description Component for viewing and managing expense transactions
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  GetApp as ExportIcon,
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import '../css/Dashboard.css';

const Transactions = () => {
  const { isDarkMode } = useTheme();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock transaction data with more realistic information
  const transactions = [
    { 
      id: 1, 
      name: 'Dinner at Restaurant',
      amount: 2500, 
      category: 'Food',
      icon: <FoodIcon />,
      color: '#FFD700',
      paidBy: 'John Doe',
      date: 'Today, 2:40 PM',
      receipt: true,
      split: 'Equally',
      members: ['John Doe', 'Jane Smith', 'Mike Johnson']
    },
    { 
      id: 2, 
      name: 'Monthly Groceries',
      amount: 5000, 
      category: 'Groceries',
      icon: <GroceriesIcon />,
      color: '#FF9999',
      paidBy: 'Jane Smith',
      date: 'Yesterday, 11:20 AM',
      receipt: true,
      split: 'Percentage',
      members: ['John Doe', 'Jane Smith']
    },
    { 
      id: 3, 
      name: 'Netflix Subscription',
      amount: 649, 
      category: 'Subscription',
      icon: <SubscriptionIcon />,
      color: '#FFC0CB',
      paidBy: 'Mike Johnson',
      date: 'Apr 1, 2024',
      receipt: false,
      split: 'Equally',
      members: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']
    },
    { 
      id: 4, 
      name: 'Weekend Trip',
      amount: 15000, 
      category: 'Travel',
      icon: <TravelIcon />,
      color: '#87CEEB',
      paidBy: 'Sarah Wilson',
      date: 'Mar 30, 2024',
      receipt: true,
      split: 'Custom',
      members: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']
    },
    { 
      id: 5, 
      name: 'Movie Night',
      amount: 1200, 
      category: 'Entertainment',
      icon: <EntertainmentIcon />,
      color: '#87CEEB',
      paidBy: 'John Doe',
      date: 'Mar 28, 2024',
      receipt: false,
      split: 'Equally',
      members: ['John Doe', 'Jane Smith']
    }
  ];

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleActionClick = (event, transaction) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedTransaction(null);
  };

  const handleEdit = () => {
    // Implement edit logic
    handleActionClose();
  };

  const handleDelete = () => {
    // Implement delete logic
    handleActionClose();
  };

  const handleViewReceipt = () => {
    // Implement view receipt logic
    handleActionClose();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Transactions</h1>
          <Typography variant="subtitle1" sx={{ color: 'var(--text-secondary)' }}>
            View and track your expenses
          </Typography>
        </div>
        <div className="date-info">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: 'var(--accent-color)',
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 500,
              px: 3,
              '&:hover': {
                backgroundColor: 'var(--accent-hover)',
              },
            }}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      <Box sx={{ 
        backgroundColor: 'var(--card-bg)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        p: 3,
        mb: 3,
      }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'var(--text-secondary)' }} />
                </InputAdornment>
              ),
              sx: {
                height: '44px',
                backgroundColor: 'var(--input-bg)',
                '&:hover': {
                  backgroundColor: 'var(--hover-bg)',
                },
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
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
              },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            sx={{
              height: '44px',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 500,
              '&:hover': {
                borderColor: 'var(--accent-color)',
                backgroundColor: 'var(--hover-bg)',
              },
            }}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExportClick}
            sx={{
              height: '44px',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 500,
              '&:hover': {
                borderColor: 'var(--accent-color)',
                backgroundColor: 'var(--hover-bg)',
              },
            }}
          >
            Export
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ 
          backgroundColor: 'transparent',
          boxShadow: 'none',
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  color: 'var(--text-secondary)', 
                  fontWeight: 500,
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                }}>
                  Name
                </TableCell>
                <TableCell sx={{ 
                  color: 'var(--text-secondary)', 
                  fontWeight: 500,
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                }}>
                  Amount
                </TableCell>
                <TableCell sx={{ 
                  color: 'var(--text-secondary)', 
                  fontWeight: 500,
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                }}>
                  Category
                </TableCell>
                <TableCell sx={{ 
                  color: 'var(--text-secondary)', 
                  fontWeight: 500,
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                }}>
                  Paid By
                </TableCell>
                <TableCell sx={{ 
                  color: 'var(--text-secondary)', 
                  fontWeight: 500,
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                }}>
                  Split
                </TableCell>
                <TableCell sx={{ 
                  color: 'var(--text-secondary)', 
                  fontWeight: 500,
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                }}>
                  Date
                </TableCell>
                <TableCell sx={{ 
                  width: 50,
                  borderBottom: '1px solid var(--border-color)',
                }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow 
                  key={transaction.id} 
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'var(--hover-bg)',
                    },
                    '& td': {
                      borderBottom: '1px solid var(--border-color)',
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {transaction.receipt && (
                        <Tooltip title="Has receipt" arrow>
                          <ReceiptIcon 
                            sx={{ 
                              fontSize: 18, 
                              color: 'var(--accent-color)',
                              opacity: 0.8
                            }} 
                          />
                        </Tooltip>
                      )}
                      <Typography sx={{ 
                        color: 'var(--text-primary)',
                        fontWeight: 500
                      }}>
                        {transaction.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ 
                      color: 'var(--text-primary)',
                      fontWeight: 500
                    }}>
                      ₹{transaction.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={transaction.icon}
                      label={transaction.category}
                      sx={{
                        backgroundColor: `${transaction.color}20`,
                        color: transaction.color,
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          color: transaction.color,
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24,
                          fontSize: '12px',
                          bgcolor: `hsl(${transactions.indexOf(transaction) * 60}, 70%, 60%)`
                        }}
                      >
                        {transaction.paidBy.charAt(0)}
                      </Avatar>
                      <Typography sx={{ color: 'var(--text-primary)' }}>
                        {transaction.paidBy}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: 'var(--text-secondary)' }}>
                      {transaction.split}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: 'var(--text-secondary)' }}>
                      {transaction.date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small"
                      onClick={(e) => handleActionClick(e, transaction)}
                      sx={{
                        color: 'var(--text-secondary)',
                        '&:hover': {
                          backgroundColor: 'var(--hover-bg)',
                        }
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            mt: 1,
            minWidth: '180px',
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              color: 'var(--text-primary)',
              '&:hover': {
                backgroundColor: 'var(--hover-bg)',
              }
            }
          },
        }}
      >
        <MenuItem onClick={handleFilterClose}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            Date Range
          </Box>
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            Category
          </Box>
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            Amount Range
          </Box>
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            Split Type
          </Box>
        </MenuItem>
      </Menu>

      {/* Export Menu */}
      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleExportClose}
        PaperProps={{
          sx: {
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            mt: 1,
            minWidth: '180px',
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              color: 'var(--text-primary)',
              '&:hover': {
                backgroundColor: 'var(--hover-bg)',
              }
            }
          },
        }}
      >
        <MenuItem onClick={handleExportClose}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            Export as CSV
          </Box>
        </MenuItem>
        <MenuItem onClick={handleExportClose}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            Export as PDF
          </Box>
        </MenuItem>
      </Menu>

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
        PaperProps={{
          sx: {
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            mt: 1,
            minWidth: '160px',
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              color: 'var(--text-primary)',
              '&:hover': {
                backgroundColor: 'var(--hover-bg)',
              }
            }
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <EditIcon fontSize="small" sx={{ color: 'var(--accent-color)' }} />
            Edit
          </Box>
        </MenuItem>
        {selectedTransaction?.receipt && (
          <MenuItem onClick={handleViewReceipt}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ReceiptIcon fontSize="small" sx={{ color: 'var(--accent-color)' }} />
              View Receipt
            </Box>
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DeleteIcon fontSize="small" sx={{ color: 'var(--error-color)' }} />
            Delete
          </Box>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Transactions; 