//backend/server.js
//import exoress from 'express';



import express from 'express';
import notesRoutes from './routes/notesRoutes.js';  
import {connectDB} from './config/db.js';
import dotenv from 'dotenv';



dotenv.config();
const app = express();
connectDB();
const PORT = process.env.PORT || 5001;

app.use('/api', notesRoutes);



app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
