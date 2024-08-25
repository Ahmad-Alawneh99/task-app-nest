import mongoose from 'mongoose';

export async function connectToMongoDB() {
	try {
		await mongoose.connect('mongodb+srv://admin:root@taskapp.lkcapkl.mongodb.net/tasks?retryWrites=true&w=majority&appName=TaskApp');
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB', error);
	}
}
