/**
 * @file Settings.js
 * @description Component for managing application settings and preferences
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Box,
  Typography,
  Switch,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Card,
  Stack,
  IconButton,
  Grid,
  TextField,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Category as CategoryIcon,
  DarkMode as DarkModeIcon,
  AccountBalance as AccountBalanceIcon,
  NotificationsActive as NotificationsActiveIcon,
  Security as SecurityIcon,
  Receipt as ReceiptIcon,
  CurrencyExchange as CurrencyExchangeIcon,
  Savings as SavingsIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import '../css/Dashboard.css';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState({
    currency: 'INR',
    notifications: {
      systemUpdates: true,
      exceedingExpenses: true,
      budgetAlerts: true,
      paymentReminders: true,
      monthlyReports: true,
      splitReminders: true,
      pushNotifications: true,
      emailReminders: true,
    },
    budgetPreferences: {
      monthlyBudget: 50000,
      budgetWarningThreshold: 80,
      autoAdjustBudget: false,
      rolloverSavings: true,
    },
    expensePreferences: {
      defaultSplitType: 'equal',
      defaultCategory: 'others',
      requireReceipts: true,
      autoCategorizeBills: true,
      enableExpenseApproval: true,
    },
    reportPreferences: {
      frequency: 'monthly',
      includeCharts: true,
      includeCategoryBreakdown: true,
      includeComparisons: true,
    },
    privacy: {
      showProfileToContacts: true,
      allowGroupInvitations: true,
      activityVisibility: 'Public',
    },
    smartSuggestions: {
      suggestCategories: true,
      suggestBudgetTweaks: true,
      autoFillPayees: true,
    },
    receiptsAndLimits: {
      suggestCategories: true,
      suggestBudgetTweaks: true,
      autoFillPayees: true,
    },
  });

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
  ];

  const reportFrequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
  ];

  const splitTypes = [
    { value: 'equal', label: 'Equal Split' },
    { value: 'percentage', label: 'Percentage Split' },
    { value: 'amount', label: 'Amount Split' },
  ];

  const expenseCategories = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'others', label: 'Others' },
  ];

  const handleNotificationChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }));
    setSuccess('Notification settings updated successfully');
  };

  const handleThemeChange = (value) => {
    setSettings(prev => ({
      ...prev,
      theme: value
    }));
    toggleTheme();
  };

  const handleBudgetPreferenceChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      budgetPreferences: {
        ...prev.budgetPreferences,
        [key]: value
      }
    }));
    setSuccess('Budget preferences updated successfully');
  };

  const handleExpensePreferenceChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      expensePreferences: {
        ...prev.expensePreferences,
        [key]: value
      }
    }));
    setSuccess('Expense preferences updated successfully');
  };

  const handleReportPreferenceChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      reportPreferences: {
        ...prev.reportPreferences,
        [key]: value
      }
    }));
    setSuccess('Report preferences updated successfully');
  };

  const handlePrivacyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
    setSuccess('Privacy settings updated successfully');
  };

  const handleDisplayChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [key]: value
      }
    }));
    setSuccess('Display settings updated successfully');
  };

  const handleSmartSuggestionsChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      smartSuggestions: {
        ...prev.smartSuggestions,
        [key]: value
      }
    }));
    setSuccess('Smart suggestions settings updated successfully');
  };

  const handleReceiptsChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      receiptsAndLimits: {
        ...prev.receiptsAndLimits,
        [key]: value
      }
    }));
    setSuccess('Receipts & limits settings updated successfully');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Settings</h1>
          <span className="premium-badge">★ PREMIUM</span>
        </div>
        <div className="date-info">
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <Grid container spacing={3}>
        {/* Currency and Theme Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 3,
            height: '100%'
          }}>
            <Stack spacing={3}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CurrencyExchangeIcon sx={{ color: 'var(--accent-color)' }} />
                  <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    Currency Settings
                  </Typography>
                </Box>
                <Typography sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                  Select your preferred currency for transactions and reports
                </Typography>
                <Select
                  fullWidth
                  value={settings.currency}
                  onChange={(e) => {
                    setSettings(prev => ({ ...prev, currency: e.target.value }));
                    setSuccess('Currency updated successfully');
                  }}
                  sx={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-color)',
                    },
                    '& .MuiSelect-icon': {
                      color: 'var(--text-primary)',
                    },
                    '& .MuiSelect-select': {
                      color: 'var(--text-primary)',
                    },
                  }}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Divider sx={{ borderColor: 'var(--border-color)' }} />

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {isDarkMode ? 
                    <DarkModeIcon sx={{ color: 'var(--accent-color)' }} /> :
                    <DarkModeIcon sx={{ color: 'var(--accent-color)' }} />
                  }
                  <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    Theme Settings
                  </Typography>
                </Box>
                <Typography sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                  Choose your preferred theme mode
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: 'var(--text-primary)' }}>Dark Mode</Typography>
                  <Switch
                    checked={isDarkMode}
                    onChange={(e) => handleThemeChange(e.target.checked ? 'dark' : 'light')}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'var(--accent-color)',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'var(--accent-color)',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Budget Preferences */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 3,
            height: '100%'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <SavingsIcon sx={{ color: 'var(--accent-color)' }} />
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Budget Preferences
              </Typography>
            </Box>

            <Stack spacing={3}>
              <Box>
                <Typography sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                  Warning Threshold (%)
                </Typography>
                <Select
                  fullWidth
                  value={settings.budgetPreferences.budgetWarningThreshold}
                  onChange={(e) => handleBudgetPreferenceChange('budgetWarningThreshold', e.target.value)}
                  sx={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-color)',
                    },
                    '& .MuiSelect-icon': {
                      color: 'var(--text-primary)',
                    },
                    '& .MuiSelect-select': {
                      color: 'var(--text-primary)',
                    },
                  }}
                >
                  {[50, 60, 70, 80, 90].map((threshold) => (
                    <MenuItem key={threshold} value={threshold}>
                      {threshold}%
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ color: 'var(--text-primary)' }}>
                    Auto-adjust Budget
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Automatically adjust based on spending patterns
                  </Typography>
                </Box>
                <Switch
                  checked={settings.budgetPreferences.autoAdjustBudget}
                  onChange={(e) => handleBudgetPreferenceChange('autoAdjustBudget', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'var(--accent-color)',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'var(--accent-color)',
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ color: 'var(--text-primary)' }}>
                    Rollover Savings
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Add unused budget to next month
                  </Typography>
                </Box>
                <Switch
                  checked={settings.budgetPreferences.rolloverSavings}
                  onChange={(e) => handleBudgetPreferenceChange('rolloverSavings', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'var(--accent-color)',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'var(--accent-color)',
                    },
                  }}
                />
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Expense Preferences */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 3,
            height: '100%'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <ReceiptIcon sx={{ color: 'var(--accent-color)' }} />
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Expense Preferences
              </Typography>
            </Box>

            <Stack spacing={3}>
              <Box>
                <Typography sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                  Default Split Type
                </Typography>
                <Select
                  fullWidth
                  value={settings.expensePreferences.defaultSplitType}
                  onChange={(e) => handleExpensePreferenceChange('defaultSplitType', e.target.value)}
                  sx={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-color)',
                    },
                    '& .MuiSelect-icon': {
                      color: 'var(--text-primary)',
                    },
                    '& .MuiSelect-select': {
                      color: 'var(--text-primary)',
                    },
                  }}
                >
                  {splitTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box>
                <Typography sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                  Default Category
                </Typography>
                <Select
                  fullWidth
                  value={settings.expensePreferences.defaultCategory}
                  onChange={(e) => handleExpensePreferenceChange('defaultCategory', e.target.value)}
                  sx={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-color)',
                    },
                    '& .MuiSelect-icon': {
                      color: 'var(--text-primary)',
                    },
                    '& .MuiSelect-select': {
                      color: 'var(--text-primary)',
                    },
                  }}
                >
                  {expenseCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ color: 'var(--text-primary)' }}>
                    Require Receipts
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    For expenses above ₹1000
                  </Typography>
                </Box>
                <Switch
                  checked={settings.expensePreferences.requireReceipts}
                  onChange={(e) => handleExpensePreferenceChange('requireReceipts', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'var(--accent-color)',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'var(--accent-color)',
                    },
                  }}
                />
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 3,
            height: '100%'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Notification Settings
              </Typography>
              <Switch
                checked={settings.notifications.enabled}
                onChange={(e) => handleNotificationChange('enabled', e.target.checked)}
              />
            </Box>
            <Typography sx={{ color: 'var(--text-secondary)', mb: 3 }}>
              Manage how and when you're alerted
            </Typography>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Push Notifications</Typography>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Email Reminders</Typography>
                <Switch
                  checked={settings.notifications.emailReminders}
                  onChange={(e) => handleNotificationChange('emailReminders', e.target.checked)}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography>Reminder Frequency</Typography>
                <Select
                  value="Daily"
                  size="small"
                  sx={{ 
                    minWidth: 120,
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-color)',
                    },
                    '& .MuiSelect-icon': {
                      color: 'var(--text-primary)',
                    },
                    '& .MuiSelect-select': {
                      color: 'var(--text-primary)',
                    },
                  }}
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Privacy & Sharing */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 3,
            height: '100%'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Privacy & Sharing
              </Typography>
              <Switch
                checked={true}
                onChange={(e) => {}}
              />
            </Box>
            <Typography sx={{ color: 'var(--text-secondary)', mb: 3 }}>
              Control your visibility and interaction with others
            </Typography>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Show Profile to Contacts</Typography>
                <Switch
                  checked={settings.privacy.showProfileToContacts}
                  onChange={(e) => handlePrivacyChange('showProfileToContacts', e.target.checked)}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Allow Invitations to Groups</Typography>
                <Switch
                  checked={settings.privacy.allowGroupInvitations}
                  onChange={(e) => handlePrivacyChange('allowGroupInvitations', e.target.checked)}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography>Activity Visibility</Typography>
                <Select
                  value="Public"
                  size="small"
                  sx={{ 
                    minWidth: 120,
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-color)',
                    },
                    '& .MuiSelect-icon': {
                      color: 'var(--text-primary)',
                    },
                    '& .MuiSelect-select': {
                      color: 'var(--text-primary)',
                    },
                  }}
                >
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Friends">Friends</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                </Select>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Receipts & Limits */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 3,
            height: '100%'
          }}>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 2 }}>
              Receipts & Limits
            </Typography>
            <Typography sx={{ color: 'var(--text-secondary)', mb: 3 }}>
              Manage proof of expenses
            </Typography>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Suggest Categories</Typography>
                <Switch
                  checked={settings.receiptsAndLimits?.suggestCategories || false}
                  onChange={(e) => handleReceiptsChange('suggestCategories', e.target.checked)}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Suggest Budget Tweaks</Typography>
                <Switch
                  checked={settings.receiptsAndLimits?.suggestBudgetTweaks || false}
                  onChange={(e) => handleReceiptsChange('suggestBudgetTweaks', e.target.checked)}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Auto-fill frequent payees</Typography>
                <Switch
                  checked={settings.receiptsAndLimits?.autoFillPayees || false}
                  onChange={(e) => handleReceiptsChange('autoFillPayees', e.target.checked)}
                />
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Smart Suggestions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 3,
            height: '100%'
          }}>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 2 }}>
              Smart Suggestions
            </Typography>
            <Typography sx={{ color: 'var(--text-secondary)', mb: 3 }}>
              (Optional AI Module)
            </Typography>
            <Typography sx={{ color: 'var(--text-tertiary)', mb: 3 }}>
              Adaptive features powered by usage
            </Typography>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Suggest Categories</Typography>
                <Switch
                  checked={settings.smartSuggestions.suggestCategories}
                  onChange={(e) => handleSmartSuggestionsChange('suggestCategories', e.target.checked)}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Suggest Budget Tweaks</Typography>
                <Switch
                  checked={settings.smartSuggestions.suggestBudgetTweaks}
                  onChange={(e) => handleSmartSuggestionsChange('suggestBudgetTweaks', e.target.checked)}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Auto-fill frequent payees</Typography>
                <Switch
                  checked={settings.smartSuggestions.autoFillPayees}
                  onChange={(e) => handleSmartSuggestionsChange('autoFillPayees', e.target.checked)}
                />
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* App Info & Support */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            p: 3,
            height: '100%'
          }}>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 2 }}>
              App Info & Support
            </Typography>
            <Typography sx={{ color: 'var(--text-secondary)', mb: 3 }}>
              Meta information and help resources
            </Typography>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>App Version</Typography>
                <Typography>v1.2.5 (Latest)</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Help Center / FAQ</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Contact Support</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Report a Bug</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" sx={{ width: '100%', borderRadius: '12px' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: '12px' }}>
          {success}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Settings; 