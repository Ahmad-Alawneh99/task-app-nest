import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const taskSchema = new mongoose.Schema({
	_id: {
		type: String,
		default: uuidv4,
	},
	title: {
		type: String,
	},
	description: {
		type: String,
	},
	status:{
		type: String,
		enum: ['PENDING', 'IN PROGRESS', 'COMPLETED'],
		default: 'PENDING',
		required: true,
	},
	dueDate: {
		type: Date,
		required: true,
	},
	owner: {
		type: String,
		ref: 'User',
	},
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
