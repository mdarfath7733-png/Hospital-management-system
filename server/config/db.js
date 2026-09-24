const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital_db';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick check
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`⚠️ Could not connect to primary MongoDB at ${uri}: ${err.message}`);
    console.log('🔄 Attempting fallback to MongoMemoryServer for development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const fallbackUri = memoryServer.getUri();
      const conn = await mongoose.connect(fallbackUri);
      console.log(`✅ Connected to fallback MongoMemoryServer: ${fallbackUri}`);
    } catch (fallbackErr) {
      console.error('❌ Failed to connect to fallback MongoMemoryServer:', fallbackErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
