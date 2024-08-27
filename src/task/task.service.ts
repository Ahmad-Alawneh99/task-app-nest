import { BadRequestException, ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import Task from '../models/task';
import TaskDTO from '../dto/Task';
import { TaskStatus } from '../shared/TaskStatus';

@Injectable()
export class TaskService {
	async findAllTasks(userId: string) {
		const tasks = await Task.find({ owner: userId });

		return tasks;
	}

	async findTask(taskId: string, userId: string) {
		const task = await Task.findById(taskId);

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

		return task.id;
	}

	async updateTask(taskData: TaskDTO, userId: string, taskId: string) {
		const existingTask = await Task.findById(taskId);

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
			...taskData.title?.trim() ? { title: taskData.title } : {},
			...taskData.description?.trim() ? { description: taskData.description } : {},
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
		const existingTask = await Task.findById(taskId);

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

	async getTasksSummary(userId: string) {
		const tasks = await Task.find({ owner: userId }).sort([['dueDate', 1]]);
		const nearestDueTasks = await Task.aggregate([
			{ $match: { $and: [{ owner: userId }, { status: { $ne: TaskStatus.COMPLETED } }] } },
			{ $sort: { dueDate: 1 } },
			{ $limit: 3 },
		]);

		const dueDates = tasks.map((task) => task.dueDate.toISOString().split('T')[0]);
		const uniqueDueDates = new Set(dueDates);

		const dueDatesMap = { ...uniqueDueDates };

		dueDates.forEach((date) => {
			dueDatesMap[date] = dueDatesMap[date] ? dueDatesMap[date] + 1 : 1;
		});

		return {
			totalTasks: tasks.length,
			pendingTasks: tasks.filter((task) => task.status === TaskStatus.PENDING).length,
			inProgressTasks: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length,
			completedTasks: tasks.filter((task) => task.status === TaskStatus.COMPLETED).length,
			tasksPerDueDate: dueDatesMap,
			nearestDueTasks: nearestDueTasks,
		};
	}
}
