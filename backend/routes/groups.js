/**
 * @file groups.js
 * @description Routes for group management and operations
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 * 
 * This file provides routes for:
 * 1. Group creation and management
 * 2. Group member operations
 * 3. Group expense tracking
 * 4. Group settings and preferences
 */

const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all groups
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ createdBy: req.user.id })
      .populate('users', 'name email')
      .populate('createdBy', 'name email');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new group
router.post('/', auth, async (req, res) => {
  try {
    const group = new Group({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.user.id,
    });
    const newGroup = await group.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a group
router.put('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    group.name = req.body.name;
    group.description = req.body.description;
    const updatedGroup = await group.save();
    res.json(updatedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a group
router.delete('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    await group.remove();
    res.json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get users in a group
router.get('/:id/users', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    const users = await User.find({ _id: { $in: group.users } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add user to group
router.post('/:id/users/:userId', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (!group.users.includes(req.params.userId)) {
      group.users.push(req.params.userId);
      await group.save();
    }
    res.json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove user from group
router.delete('/:id/users/:userId', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    group.users = group.users.filter(userId => userId.toString() !== req.params.userId);
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Export the router
module.exports = router; 