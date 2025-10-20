import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const host = process.env.HOST;
const port = process.env.PORT;

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
