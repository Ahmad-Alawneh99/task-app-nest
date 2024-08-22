import mongoose from 'mongoose';

export async function connectToMongoDB() {
	try {
		await mongoose.connect('');
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB', error);
	}
}
