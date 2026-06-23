const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const studentRoutes = require('./routes/studentRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const matchRoutes = require('./routes/matchRoutes');
const adminRoutes = require('./routes/adminRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// Routes (placeholder)
app.get('/', (req, res) => {
  res.send('TalentBridge API is running...');
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/announcements', announcementRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
