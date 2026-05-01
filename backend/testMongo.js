import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://gone123456006_db_user:CqI2vhMepyv4m3Xo@employment-cluster.eeuwgqd.mongodb.net/finovert?retryWrites=true&w=majority&appName=employment-cluster';

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("SUCCESS");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAIL:", err.message);
    process.exit(1);
  });
