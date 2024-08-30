import mongoose from 'mongoose';

export async function connectToMongoDB() {
	try {
		await mongoose.connect('mongodb://localhost:27017/tasks');
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB', error);
	}
}
