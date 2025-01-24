const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  pool
    .connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => console.log(err));
}
app.use('/api/users', userRoutes);
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);

module.exports = { app };
