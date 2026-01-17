import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/connectDB.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect DB first
connectDB();

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
