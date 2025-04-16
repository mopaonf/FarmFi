const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const FarmerRoutes = require('./routes/farmers/FarmerRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
   cors({
      origin: '*', // Allow all origins for development
   })
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/farmers', FarmerRoutes); // Ensure this matches the frontend URL

// MongoDB Connection
mongoose
   .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log('MongoDB connected');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   })
   .catch((err) => console.error('MongoDB connection error:', err));
