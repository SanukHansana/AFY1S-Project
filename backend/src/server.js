dotenv.config()
import dotenv from 'dotenv';

import express from 'express';
import notesRoutes from './routes/notesRoutes.js';  
import {connectDB} from './config/db.js';
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from './middleware/errormiddleware.js'
import reviewRoutes from "./routes/review.routes.js";
import skillRoutes from "./routes/skillRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";


const app = express();
connectDB();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api', notesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/jobs", jobRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
