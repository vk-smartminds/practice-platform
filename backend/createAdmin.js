import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline/promises'; // Use the promise-based API
import Admin from './models/adminModel.js';

// Load environment variables from .env file
dotenv.config();

const createAdmin = async () => {
  // We need to keep a reference to the connection to close it in the finally block
  let dbConnection; 
  
  try {
    // 1. Connect to the database
    dbConnection = await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB Connected...');

    // 2. Setup the command-line interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // 3. Ask questions sequentially using await
    const name = await rl.question('Enter admin name: ');
    const email = await rl.question('Enter admin email: ');
    const password = await rl.question('Enter admin password: ');

    // 4. Close the interface now that we have all the input
    rl.close();

    // 5. Validate the input
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    // 6. Check if an admin with that email already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      throw new Error('An admin with this email already exists.');
    }

    // 7. Create the new admin (password will be hashed by the pre-save hook in the model)
    const admin = new Admin({ name, email, password });
    await admin.save();
    
    console.log('\n Admin created successfully!');

  } catch (error) {
    console.error(`\n Error: ${error.message}`);
  } finally {
    // 8. Ensure the database connection is always closed, whether it succeeded or failed
    if (dbConnection) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    }
    // 9. Exit the script
    process.exit();
  }
};

// Run the script
createAdmin();