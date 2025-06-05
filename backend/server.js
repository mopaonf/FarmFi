const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AdminRoutes = require('./routes/admins/AdminRoutes');
const FarmerRoutes = require('./routes/farmers/FarmerRoutes');
const ProjectRoutes = require('./routes/projects/ProjectRoutes');
const InvestorRoutes = require('./routes/investors/InvestorRoutes');
const investmentRoutes = require('./routes/investments/InvestmentRoutes');
const WalletRoutes = require('./routes/wallets/WalletRoutes');
const transactionRoutes = require('./routes/transactions/TransactionRoutes');
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

// Add request logging middleware
app.use((req, res, next) => {
   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
   console.log('Request headers:', req.headers);
   console.log('Request body:', req.body);

   // Log response
   const oldSend = res.send;
   res.send = function (data) {
      console.log('Response:', data);
      oldSend.apply(res, arguments);
   };

   next();
});

// Add error handling middleware
app.use((err, req, res, next) => {
   console.error('Server error:', err);
   res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
   });
});

// Routes
app.use('/api/farmers', FarmerRoutes); // Ensure this matches the frontend URL
app.use('/api/admins', AdminRoutes); // Ensure this matches the frontend URL
app.use('/api/projects', ProjectRoutes);
app.use('/api/investors', InvestorRoutes); // Ensure this matches the frontend URL
app.use('/api/investments', investmentRoutes);
app.use('/api/wallets', WalletRoutes);
app.use('/api/transactions', transactionRoutes);
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
