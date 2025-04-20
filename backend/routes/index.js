/**
 * @file index.js
 * @description Main router configuration for the application
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 * 
 * This file:
 * 1. Sets up the main Express router
 * 2. Imports and configures all route modules
 * 3. Defines base routes for the API
 * 4. Handles route error handling
 */

const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./users');
const groupRoutes = require('./groups');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);

module.exports = router; 