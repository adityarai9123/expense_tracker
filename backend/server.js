const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/expenses', expenseRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Handle port-in-use errors gracefully
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`   Try: npx kill-port ${PORT}   or change PORT in .env`);
    process.exit(1);
  }
  throw err;
});

// Graceful shutdown
const shutdown = () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
