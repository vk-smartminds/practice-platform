import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import your route files
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Basic Configuration 
dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 8000;

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Middleware Setup
// Enable CORS to allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:3000', // The origin of your Next.js app
  credentials: true, // This is important for sending/receiving cookies
}));

app.use(express.json()); // To parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(cookieParser()); // To parse cookies from the request headers

// API Routes
// Mount the routers to their specific base paths
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/content', contentRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the Server
const startServer = async () => {
  await connectDB(); // First, connect to the database
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

// Run the application
startServer();