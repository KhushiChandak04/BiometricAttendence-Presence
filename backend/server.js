const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with proper error handling
mongoose.set('strictQuery', false); // Add this line for Mongoose 7+
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://khushichandak2005:khac2005@biometricattendence.jolt8.mongodb.net/attendance_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Biometric Attendance API is running' });
});

// Import routes
const analyticsRoutes = require('./routes/analytics');
const teamRoutes = require('./routes/team');
const attendanceRoutes = require('./routes/attendance');

// Use routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/attendance', attendanceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
