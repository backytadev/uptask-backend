import express, { Express } from 'express';
import dotenv from 'dotenv';

import { connectDB } from './config/db';
import projectRoutes from './routes/projectRoutes';

dotenv.config();
connectDB();

const app: Express = express();

app.use(express.json());

//* Routes
app.use('/api/projects', projectRoutes);

export default app;
