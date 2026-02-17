
import Note from '../models/Note.js';

export async function getAllNotes(req, res) {
    
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Server error' });
    }
}  