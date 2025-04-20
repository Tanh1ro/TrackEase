/**
 * @file ProfilePage.js
 * @description Component for user profile management and settings
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Switch,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
  IconButton,
  Stack,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Upload as UploadIcon,
  ArrowForward as ArrowForwardIcon,
  Google as GoogleIcon,
  Apple as AppleIcon,
  Facebook as FacebookIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Diamond as DiamondIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import '../css/Dashboard.css';

const ProfilePage = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '+91.9876543210',
    currency: 'USD',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    timeZone: 'GMT+05:30 — IST',
    twoFactorEnabled: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  const handlePasswordChange = (field) => (event) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const togglePasswordVisibility = (field) => () => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <div className="dashboard-header" style={{ marginBottom: '32px' }}>
        <div className="welcome-section">
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Profile Settings</h1>
          <Typography variant="subtitle1" sx={{ color: 'var(--text-secondary)' }}>
            Manage your account settings and preferences
          </Typography>
        </div>
      </div>

      <Grid 
        container 
        spacing={3} 
        sx={{
          maxWidth: '1400px',
          margin: '0 auto',
          alignItems: 'stretch'
        }}
      >
        {/* Basic Info Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 4,
            height: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 4,
              pb: 3,
              borderBottom: '1px solid var(--border-color)'
            }}>
              <PersonIcon sx={{ color: 'var(--accent-color)', fontSize: 32 }} />
              <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Basic Info
              </Typography>
            </Box>
            
            <Stack spacing={4}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 4,
                p: 2,
                bgcolor: 'var(--hover-bg)',
                borderRadius: '12px'
              }}>
                <Avatar
                  sx={{ 
                    width: 120, 
                    height: 120,
                    bgcolor: 'var(--accent-color)',
                    fontSize: '3rem',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Box>
                  <Button
                    startIcon={<UploadIcon />}
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: 'var(--accent-color)',
                      color: '#fff',
                      px: 3,
                      py: 1.5,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'var(--accent-hover)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s'
                      }
                    }}
                  >
                    Upload New Picture
                  </Button>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 1 }}>
                    Recommended: 400x400px, Max 2MB
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.fullName}
                    placeholder="Enter your full name"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'var(--input-bg)',
                        borderRadius: '8px',
                        '& fieldset': { borderColor: 'var(--border-color)' },
                        '&:hover fieldset': { borderColor: 'var(--accent-color)' },
                        '&.Mui-focused fieldset': { borderColor: 'var(--accent-color)' },
                        '& input': { padding: '14px 16px' }
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.username}
                    placeholder="Choose a username"
                    InputProps={{
                      startAdornment: <Typography sx={{ color: 'var(--text-secondary)', mr: 1, fontWeight: 500 }}>@</Typography>
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'var(--input-bg)',
                        borderRadius: '8px',
                        '& fieldset': { borderColor: 'var(--border-color)' },
                        '&:hover fieldset': { borderColor: 'var(--accent-color)' },
                        '&.Mui-focused fieldset': { borderColor: 'var(--accent-color)' },
                        '& input': { padding: '14px 16px' }
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Email Address
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      value={formData.email}
                      placeholder="Enter your email"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'var(--input-bg)',
                          borderRadius: '8px',
                          '& fieldset': { borderColor: 'var(--border-color)' },
                          '&:hover fieldset': { borderColor: 'var(--accent-color)' },
                          '&.Mui-focused fieldset': { borderColor: 'var(--accent-color)' },
                          '& input': { padding: '14px 16px' }
                        }
                      }}
                    />
                    <Button 
                      variant="outlined"
                      sx={{ 
                        minWidth: '100px',
                        color: 'var(--accent-color)',
                        borderColor: 'var(--accent-color)',
                        '&:hover': { 
                          backgroundColor: 'var(--hover-bg)',
                          borderColor: 'var(--accent-color)'
                        }
                      }}
                    >
                      Change
                    </Button>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Phone Number
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      value={formData.phone}
                      placeholder="Enter your phone number"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'var(--input-bg)',
                          borderRadius: '8px',
                          '& fieldset': { borderColor: 'var(--border-color)' },
                          '&:hover fieldset': { borderColor: 'var(--accent-color)' },
                          '&.Mui-focused fieldset': { borderColor: 'var(--accent-color)' },
                          '& input': { padding: '14px 16px' }
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      sx={{ 
                        minWidth: '100px',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-color)',
                        '&:hover': {
                          borderColor: 'var(--accent-color)',
                          backgroundColor: 'var(--hover-bg)'
                        }
                      }}
                    >
                      Verify
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Change Password Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 4,
            height: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 4,
              pb: 3,
              borderBottom: '1px solid var(--border-color)'
            }}>
              <SettingsIcon sx={{ color: 'var(--accent-color)', fontSize: 32 }} />
              <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Change Password
              </Typography>
            </Box>
            
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Current Password
                </Typography>
                <TextField
                  fullWidth
                  type={passwordForm.showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange('currentPassword')}
                  placeholder="Enter current password"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={togglePasswordVisibility('showCurrentPassword')}
                        edge="end"
                        sx={{ color: 'var(--text-secondary)' }}
                      >
                        {passwordForm.showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--input-bg)',
                      borderRadius: '8px',
                      '& fieldset': { borderColor: 'var(--border-color)' },
                      '&:hover fieldset': { borderColor: 'var(--accent-color)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--accent-color)' },
                      '& input': { padding: '14px 16px' }
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  New Password
                </Typography>
                <TextField
                  fullWidth
                  type={passwordForm.showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange('newPassword')}
                  placeholder="Enter new password"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={togglePasswordVisibility('showNewPassword')}
                        edge="end"
                        sx={{ color: 'var(--text-secondary)' }}
                      >
                        {passwordForm.showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--input-bg)',
                      borderRadius: '8px',
                      '& fieldset': { borderColor: 'var(--border-color)' },
                      '&:hover fieldset': { borderColor: 'var(--accent-color)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--accent-color)' },
                      '& input': { padding: '14px 16px' }
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Confirm New Password
                </Typography>
                <TextField
                  fullWidth
                  type={passwordForm.showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange('confirmPassword')}
                  placeholder="Confirm new password"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={togglePasswordVisibility('showConfirmPassword')}
                        edge="end"
                        sx={{ color: 'var(--text-secondary)' }}
                      >
                        {passwordForm.showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--input-bg)',
                      borderRadius: '8px',
                      '& fieldset': { borderColor: 'var(--border-color)' },
                      '&:hover fieldset': { borderColor: 'var(--accent-color)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--accent-color)' },
                      '& input': { padding: '14px 16px' }
                    }
                  }}
                />
              </Box>

              <Box sx={{ mt: 'auto', pt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    backgroundColor: 'var(--accent-color)',
                    py: 1.5,
                    borderRadius: '8px',
                    '&:hover': { 
                      backgroundColor: 'var(--accent-hover)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    }
                  }}
                >
                  Update Password
                </Button>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Account Security Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 4,
            height: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 4,
              pb: 3,
              borderBottom: '1px solid var(--border-color)'
            }}>
              <SettingsIcon sx={{ color: 'var(--accent-color)', fontSize: 32 }} />
              <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Account Security
              </Typography>
            </Box>
            
            <Stack spacing={4}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 3,
                bgcolor: 'var(--hover-bg)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 0.5 }}>
                    Two-Factor Authentication
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                    Add an extra layer of security to your account
                  </Typography>
                </Box>
                <Switch 
                  checked={formData.twoFactorEnabled}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'var(--accent-color)',
                      '& + .MuiSwitch-track': {
                        backgroundColor: 'var(--accent-color)'
                      }
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 3, color: 'var(--text-primary)', fontWeight: 600 }}>
                  Linked Accounts
                </Typography>
                <Stack spacing={3}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'var(--hover-bg)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: '8px', 
                        backgroundColor: '#DB4437',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <GoogleIcon sx={{ color: '#fff', fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>Google</Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                          Connected
                        </Typography>
                      </Box>
                    </Box>
                    <Button 
                      variant="outlined"
                      size="small"
                      sx={{ 
                        color: 'var(--error-color)',
                        borderColor: 'var(--error-color)',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.04)',
                          borderColor: 'var(--error-color)'
                        }
                      }}
                    >
                      Unlink
                    </Button>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'var(--hover-bg)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: '8px', 
                        backgroundColor: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <AppleIcon sx={{ color: '#fff', fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>Apple</Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                          Not connected
                        </Typography>
                      </Box>
                    </Box>
                    <Button 
                      variant="outlined"
                      size="small"
                      sx={{ 
                        color: 'var(--accent-color)',
                        borderColor: 'var(--accent-color)',
                        '&:hover': {
                          backgroundColor: 'var(--hover-bg)',
                          borderColor: 'var(--accent-color)'
                        }
                      }}
                    >
                      Link
                    </Button>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'var(--hover-bg)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: '8px', 
                        backgroundColor: '#4267B2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FacebookIcon sx={{ color: '#fff', fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>Facebook</Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                          Connected
                        </Typography>
                      </Box>
                    </Box>
                    <Button 
                      variant="outlined"
                      size="small"
                      sx={{ 
                        color: 'var(--error-color)',
                        borderColor: 'var(--error-color)',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.04)',
                          borderColor: 'var(--error-color)'
                        }
                      }}
                    >
                      Unlink
                    </Button>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ mt: 'auto', pt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    backgroundColor: 'var(--accent-color)',
                    py: 1.5,
                    borderRadius: '8px',
                    '&:hover': { 
                      backgroundColor: 'var(--accent-hover)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    }
                  }}
                >
                  Logout Everywhere
                </Button>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Preferences Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 4,
            height: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <SettingsIcon sx={{ color: 'var(--accent-color)', fontSize: 28 }} />
              <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Preferences
              </Typography>
            </Box>

            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--text-secondary)' }}>
                  Preferred Currency
                </Typography>
                <Select
                  fullWidth
                  value={formData.currency}
                  sx={{
                    backgroundColor: 'var(--input-bg)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-color)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--accent-color)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--accent-color)'
                    }
                  }}
                >
                  <MenuItem value="USD">USD — US Dollar</MenuItem>
                  <MenuItem value="EUR">EUR — Euro</MenuItem>
                  <MenuItem value="GBP">GBP — British Pound</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--text-secondary)' }}>
                    Language
                  </Typography>
                  <Select
                    fullWidth
                    value={formData.language}
                    sx={{
                      backgroundColor: 'var(--input-bg)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--border-color)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--accent-color)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--accent-color)'
                      }
                    }}
                  >
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                  </Select>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--text-secondary)' }}>
                    Date Format
                  </Typography>
                  <RadioGroup row value={formData.dateFormat}>
                    <FormControlLabel
                      value="MM/DD/YYYY"
                      control={
                        <Radio 
                          sx={{
                            color: 'var(--text-secondary)',
                            '&.Mui-checked': {
                              color: 'var(--accent-color)'
                            }
                          }}
                        />
                      }
                      label="MM/DD/YYYY"
                    />
                    <FormControlLabel
                      value="DD/MM/YYYY"
                      control={
                        <Radio 
                          sx={{
                            color: 'var(--text-secondary)',
                            '&.Mui-checked': {
                              color: 'var(--accent-color)'
                            }
                          }}
                        />
                      }
                      label="DD/MM/YYYY"
                    />
                  </RadioGroup>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--text-secondary)' }}>
                  Time Zone
                </Typography>
                <Select
                  fullWidth
                  value={formData.timeZone}
                  sx={{
                    backgroundColor: 'var(--input-bg)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-color)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--accent-color)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--accent-color)'
                    }
                  }}
                >
                  <MenuItem value="GMT+05:30 — IST">GMT+05:30 — IST</MenuItem>
                  <MenuItem value="GMT+00:00 — UTC">GMT+00:00 — UTC</MenuItem>
                </Select>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Account Actions Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 4,
            height: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <PersonIcon sx={{ color: 'var(--accent-color)', fontSize: 28 }} />
              <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Account Actions
              </Typography>
            </Box>

            <Stack spacing={3}>
              <Button
                startIcon={<DeleteIcon sx={{ color: 'var(--error-color)', fontSize: 24 }} />}
                sx={{
                  justifyContent: 'flex-start',
                  color: 'var(--error-color)',
                  py: 2,
                  px: 3,
                  '&:hover': { 
                    backgroundColor: 'var(--hover-bg)',
                    transform: 'translateX(8px)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                Delete Account
              </Button>
              <Button
                startIcon={<DownloadIcon sx={{ color: 'var(--accent-color)', fontSize: 24 }} />}
                sx={{
                  justifyContent: 'flex-start',
                  color: 'var(--accent-color)',
                  py: 2,
                  px: 3,
                  '&:hover': { 
                    backgroundColor: 'var(--hover-bg)',
                    transform: 'translateX(8px)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                Download My Data (GDPR)
              </Button>
            </Stack>
          </Card>
        </Grid>

        {/* Premium & Billing Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 4,
            height: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <DiamondIcon sx={{ color: 'var(--accent-color)', fontSize: 28 }} />
              <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Premium & Billing
              </Typography>
            </Box>

            <Stack spacing={4}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                bgcolor: 'var(--hover-bg)',
                borderRadius: '8px'
              }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Current Plan:
                </Typography>
                <Typography variant="h6" sx={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                  Premium
                </Typography>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                bgcolor: 'var(--hover-bg)',
                borderRadius: '8px'
              }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Valid Till:
                </Typography>
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  20 May 2025
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: 'var(--accent-color)',
                    py: 1.5,
                    '&:hover': { 
                      backgroundColor: 'var(--accent-hover)',
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s'
                    }
                  }}
                >
                  Upgrade Plan
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'var(--accent-color)',
                      backgroundColor: 'var(--hover-bg)',
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s'
                    }
                  }}
                >
                  Downgrade
                </Button>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfilePage;