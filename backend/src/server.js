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
import skillRoutes from "./routes/skillRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";


dotenv.config();

// Fallback JWT_SECRET for testing (in production, this should be in .env)
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-key-for-development-only';
}
const app = express();
connectDB();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

app.use('/api', notesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
