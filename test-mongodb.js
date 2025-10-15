// Test MongoDB Connection
const mongoose = require('mongoose');

// MongoDB URI from .env.local
const MONGODB_URI = 'mongodb+srv://eren:1234@cluster0.mongodb.net/courier';

console.log('🔄 Testing MongoDB connection...');
console.log('URI:', MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Hide password

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  console.log('Database:', mongoose.connection.db.databaseName);
  console.log('Host:', mongoose.connection.host);
  
  // Test creating a simple document
  return mongoose.connection.db.collection('test').insertOne({
    test: 'Connection test',
    timestamp: new Date()
  });
})
.then(result => {
  console.log('✅ Test document created:', result.insertedId);
  console.log('\n🎉 MongoDB is working correctly!\n');
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.error('\nPlease check:');
  console.error('1. MongoDB credentials are correct');
  console.error('2. Network connection is available');
  console.error('3. MongoDB cluster is running');
  process.exit(1);
});
