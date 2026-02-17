
import mongoose from 'mongoose';

export const connectDB = async () => {
    
    try{
       

        await mongoose.connect("mongodb+srv://year3semester1project_db_user:gwUm9W0fJofjZ7jD@afprojects.hucep3e.mongodb.net/?appName=AFProjects");
        console.log('MongoDB connected successfully');
    }catch (error){
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }   

};


