//backend/routes/notesRoutes.js
import express from 'express';
import { getAllNotes } from '../controllers/notesControllers.js';

const router = express.Router();    



router.get ('/', getAllNotes);


export default router;
