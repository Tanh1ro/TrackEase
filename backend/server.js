require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDatabase = require('./config/init');
const authController = require('./controllers/authController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Initialize database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 