//backend/server.js
//import exoress from 'express';



import express from 'express';
import notesRoutes from './routes/notesRoutes.js';  
import {connectDB} from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from './middleware/errormiddleware.js'
import reviewRoutes from "./routes/review.routes.js";


dotenv.config();
const app = express();
connectDB();
const PORT = process.env.PORT || 5001;

app.use('/api', notesRoutes);

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
