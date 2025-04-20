/**
 * @file Dashboard.jsx
 * @description Main dashboard component displaying user overview and quick actions
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 * 
 * This component provides:
 * 1. Overview of user's expenses and groups
 * 2. Quick access to common actions
 * 3. Summary statistics and charts
 * 4. Category-wise expense breakdown
 */

import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import '../css/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { userData } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState('Day');
  const [selectedView, setSelectedView] = useState('Expense');
  const [activeTab, setActiveTab] = useState(0);

  // Mock data for expense categories
  const expenseCategories = [
    {
      id: 1,
      name: 'Monthly Bills',
      description: "Regular monthly expenses",
      tasksCompleted: '8 from 10 bills paid',
      amount: 1490.00,
      trend: 'down',
      progressPercent: 80,
      icon: '💰',
      color: '#FF6B6B'
    },
    {
      id: 2,
      name: 'Groceries',
      description: "Food and household items",
      tasksCompleted: '12 transactions this month',
      amount: 590.00,
      trend: 'up',
      progressPercent: 100,
      icon: '🛒',
      color: '#4ECDC4'
    },
    {
      id: 3,
      name: 'Entertainment',
      description: "Leisure and recreation",
      tasksCompleted: '5 transactions this month',
      amount: 260.00,
      trend: 'up',
      progressPercent: 65,
      icon: '🎮',
      color: '#45B7D1'
    }
  ];

  // Mock data for top spending categories
  const topCategories = [
    { id: 1, name: 'Rent', amount: 1200.00, trend: 'up', icon: '🏠', color: '#FF9F43' },
    { id: 2, name: 'Utilities', amount: 245.50, trend: 'down', icon: '💡', color: '#28C76F' },
    { id: 3, name: 'Transportation', amount: 180.30, trend: 'down', icon: '🚗', color: '#7367F0' },
    { id: 4, name: 'Dining Out', amount: 325.75, trend: 'up', icon: '🍽️', color: '#EA5455' }
  ];

  // Line Chart data
  const lineChartData = {
    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: [980, 1230, 1100, 1300, 1200, 1100],
        borderColor: '#7269ff',
        backgroundColor: 'rgba(114, 105, 255, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Donut Chart data for category expenses
  const donutChartData = {
    labels: [...expenseCategories.map(cat => cat.name), ...topCategories.map(cat => cat.name)],
    datasets: [{
      data: [...expenseCategories.map(cat => cat.amount), ...topCategories.map(cat => cat.amount)],
      backgroundColor: [...expenseCategories.map(cat => cat.color), ...topCategories.map(cat => cat.color)],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `$${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h2>Good afternoon,</h2>
          <h1>{userData?.name || 'Root User'}</h1>
        </div>
        <div className="header-actions">
          <button className="notifications-btn">🔔</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="balance-card">
          <div className="balance-header">
            <h3>Total Balance</h3>
            <button className="more-options">⋮</button>
          </div>
          <div className="balance-amount">
            <h2>$2,548.00</h2>
          </div>
          <div className="balance-details">
            <div className="income-section">
              <span className="label">↓ Income</span>
              <span className="amount">$1,840.00</span>
            </div>
            <div className="expenses-section">
              <span className="label">↑ Expenses</span>
              <span className="amount">$284.00</span>
            </div>
          </div>
        </div>

        <div className="team-members-grid">
          {expenseCategories.map(category => (
            <div key={category.id} className="member-card">
              <div className="member-info">
                <div className="category-icon">{category.icon}</div>
                <div className="member-details">
                  <h3>{category.name}</h3>
                  <p className="member-role">{category.description}</p>
                  <p className="tasks-completed">{category.tasksCompleted}</p>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${category.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="member-stats">
                <span className={`amount ${category.trend}`}>
                  ${category.amount.toFixed(2)}
                </span>
                <span className="period">This month</span>
                <span className={`trend-indicator ${category.trend}`}>
                  {category.trend === 'up' ? '↗' : '↘'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="statistics-section" style={{ 
          backgroundColor: 'var(--card-bg)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div className="section-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{ 
              color: 'var(--text-primary)',
              margin: 0
            }}>Statistics</h2>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem'
            }}>
              <div className="period-selector" style={{
                display: 'flex',
                gap: '8px',
                backgroundColor: 'var(--input-bg)',
                padding: '4px',
                borderRadius: '12px'
              }}>
                {['Day', 'Week', 'Month', 'Year'].map(period => (
                  <button
                    key={period}
                    className={selectedPeriod === period ? 'active' : ''}
                    onClick={() => setSelectedPeriod(period)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: selectedPeriod === period ? 'var(--accent-color)' : 'transparent',
                      color: selectedPeriod === period ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '14px'
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </div>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '24px',
            height: '400px'
          }}>
            <div style={{ 
              padding: '16px',
              backgroundColor: 'var(--card-bg-light)',
              borderRadius: '12px',
              height: '100%'
            }}>
              <h3 style={{ 
                marginBottom: '16px', 
                color: 'var(--text-secondary)',
                fontSize: '16px',
                fontWeight: 500
              }}>
                Expense Trend
              </h3>
              <div style={{ height: 'calc(100% - 40px)' }}>
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>
            <div style={{ 
              padding: '16px',
              backgroundColor: 'var(--card-bg-light)',
              borderRadius: '12px',
              height: '100%'
            }}>
              <h3 style={{ 
                marginBottom: '16px', 
                color: 'var(--text-secondary)',
                fontSize: '16px',
                fontWeight: 500
              }}>
                Expense Distribution
              </h3>
              <div style={{ height: 'calc(100% - 40px)' }}>
                <Doughnut data={donutChartData} options={donutChartOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="top-countries">
          <div className="section-header">
            <h2>Top Categories</h2>
            <span className="subtitle">most spent</span>
            <button className="add-button" title="Add new category">+</button>
          </div>
          <div className="countries-list">
            {topCategories.map(category => (
              <div key={category.id} className="country-item">
                <div className="country-info">
                  <span className="country-flag">{category.icon}</span>
                  <span className="country-name">{category.name}</span>
                </div>
                <div className="country-stats">
                  <span className={`amount ${category.trend}`}>
                    ${category.amount.toFixed(2)}
                  </span>
                  <span className={`trend-indicator ${category.trend}`}>
                    {category.trend === 'up' ? '↗' : '↘'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="check-all-button">View All Categories</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;