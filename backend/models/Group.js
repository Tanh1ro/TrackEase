/**
 * @file Group.js
 * @description Group model for managing expense sharing groups
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 * 
 * This model defines:
 * 1. Group structure and properties
 * 2. Group member relationships
 * 3. Group expense tracking
 * 4. Group settings and preferences
 */

const mongoose = require('mongoose');

// Group schema definition
const groupSchema = new mongoose.Schema({
  // Group name
  name: {
    type: String,
    required: true,
    trim: true,
  },
  
  // Group description
  description: {
    type: String,
    trim: true,
  },
  
  // Group members (references to User model)
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  
  // Group creator (reference to User model)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Group creation timestamp
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

// Create and export the Group model
module.exports = mongoose.model('Group', groupSchema); 