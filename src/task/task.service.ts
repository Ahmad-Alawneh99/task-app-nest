import { BadRequestException, ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import Task from '../models/task';
import { TaskDTO } from 'src/dto/Task';

@Injectable()
export class TaskService {
	async findAllTasks(userId: string) {
		const tasks = await Task.find({ owner: userId });

		return tasks;
	}

	async findTask(taskId: string, userId: string) {
		const task = await Task.findById({ _id: taskId }); // @TODO: consider refactoring this since it's used in multiple places

		if (!task) {
			throw new BadRequestException(
				{ success: false, code: HttpStatus.BAD_REQUEST, message: 'Task not found' },
			);
		}

		if (task.owner !== userId) {
			throw new ForbiddenException(
				{ success: false, code: HttpStatus.FORBIDDEN, message: 'You don\'t have access to retrieve this task' },
			);
		}

		return task;
	}

	async createTask(taskData: TaskDTO, userId: string) {
		const task = new Task({
			title: taskData.title,
			description: taskData.description,
			status: taskData.status,
			dueDate: taskData.dueDate,
			owner: userId,
		});

		await task.save();

		return task._id;
	}

	async updateTask(taskData: TaskDTO, taskId: string, userId: string) {
		const existingTask = await Task.findById({ _id: taskId });

		if (!existingTask) {
			throw new BadRequestException(
				{ success: false, code: HttpStatus.BAD_REQUEST, message: 'Task not found' },
			);
		}

		if (existingTask.owner !== userId) {
			throw new ForbiddenException(
				{ success: false, code: HttpStatus.FORBIDDEN, message: 'You don\'t have access to retrieve this task' },
			);
		}

		const updatedTask: Partial<TaskDTO> = {
			...taskData.title ? { title: taskData.title } : {},
			...taskData.description ? { description: taskData.description } : {},
			...taskData.status ? { status: taskData.status } : {},
			...taskData.dueDate ? { dueDate: taskData.dueDate } : {},
		};

		if (Object.keys(updatedTask).length === 0) {
			throw new BadRequestException(
				{ success: false, code: HttpStatus.BAD_REQUEST, message: 'No values to update' },
			);
		}

		await Task.findByIdAndUpdate(taskId, updatedTask);
	}

	async deleteTask(userId: string, taskId: string) {
		const existingTask = await Task.findById({ _id: taskId });

		if (!existingTask) {
			throw new BadRequestException(
				{ success: false, code: HttpStatus.BAD_REQUEST, message: 'Task not found' },
			);
		}

		if (existingTask.owner !== userId) {
			throw new ForbiddenException(
				{ success: false, code: HttpStatus.FORBIDDEN, message: 'You don\'t have access to retrieve this task' },
			);
		}

		await Task.findByIdAndDelete(taskId);
	}
}
