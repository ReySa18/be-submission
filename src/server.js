import dotenv from 'dotenv';
import app from './app.js';
import { connectRedis } from './config/redis.js';

dotenv.config();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectRedis();

    app.listen(port, host, () => {
      console.log(`🚀 Server running at http://${host}:${port}`);
    });
  } catch (error) {
    console.error('❌ Gagal konek ke Redis:', error);
    process.exit(1);
  }
};

startServer();
