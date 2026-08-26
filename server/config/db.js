import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_complaint_db';

  try {
    console.log('⏳ Connecting to MongoDB at:', uri.replace(/:([^:@]{1,})@/, ':****@'));
    const conn = await mongoose.connect(uri, {
      dbName: 'college_complaint_db',
      serverSelectionTimeoutMS: 5000,
    });
    console.log(` MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('================================================================');
    console.error('⚠️  MONGODB CONNECTION NOTICE:');
    console.error(`   ${error.message}`);
    console.error('   Please ensure MongoDB is running or configure your MongoDB Atlas');
    console.error('   connection string in server/.env (e.g. MONGODB_URI=mongodb+srv://...)');
    console.error('================================================================');
    // Do not terminate process in development so server continues serving static/health routes
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
};
