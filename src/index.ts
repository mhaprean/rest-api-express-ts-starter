import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

const init = async () => {
  if (!process.env.MONGO_DB_URL) {
    console.log('MONGO_URL is not defined in the env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    app.listen(PORT, () => {
      console.log('app started');
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

init();
