// backend/src/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const suggestionRoutes = require('./routes/suggestions');
const submissionRoutes = require('./routes/submissions');

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI Project Folio API running');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/submissions', submissionRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
