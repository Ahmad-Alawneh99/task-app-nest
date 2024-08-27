import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { UserID } from 'src/shared/userId.decorator';
import TaskDTO from 'src/dto/Task';

@Controller('tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Get()
	async findAllTasks(@UserID() userId: string) {
		try {
			const tasks = await this.taskService.findAllTasks(userId);

			return {
				success: true,
				code: HttpStatus.OK,
				tasks,
			};
		} catch (error) {
			throw new HttpException(
				{
					success: false,
					code: HttpStatus.INTERNAL_SERVER_ERROR,
					message: `Something went wrong when getting tasks: ${error.message || 'Unknown error'}`,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('/summary')
	async getTasksSummary(@UserID() userId: string) {
		try {
			const tasksSummary = await this.taskService.getTasksSummary(userId);

			return {
				success: true,
				code: HttpStatus.OK,
				tasksSummary,
			};
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(
				{
					success: false,
					code: HttpStatus.INTERNAL_SERVER_ERROR,
					message: `Something went wrong when creating the task: ${error.message || 'Unknown error'}`,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Post()
	async createTask(@Body() task: TaskDTO, @UserID() userId: string) {
		try {
			if (!task.title.trim() || !task.dueDate || !task.status) {
				throw new BadRequestException({
					success: false,
					code: HttpStatus.BAD_REQUEST,
					message: 'Required fields are missing, ensure that title and dueDate are provided',
				});
			}

			const createdTaskId = await this.taskService.createTask(task, userId);

			return {
				success: true,
				code: HttpStatus.CREATED,
				taskId: createdTaskId,
			};
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(
				{
					success: false,
					code: HttpStatus.INTERNAL_SERVER_ERROR,
					message: `Something went wrong when creating the task: ${error.message || 'Unknown error'}`,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get(':id')
	async findTask(@Param('id') taskId: string, @UserID() userId: string) {
		try {
			const task = await this.taskService.findTask(taskId, userId);

			return {
				success: true,
				code: HttpStatus.OK,
				task,
			};
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(
				{
					success: false,
					code: HttpStatus.INTERNAL_SERVER_ERROR,
					message: `Something went wrong when getting the task: ${error.message || 'Unknown error'}`,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Put(':id')
	async updateTask(@Body() taskData: TaskDTO, @UserID() userId: string, @Param('id') taskId: string) {
		try {
			if (!taskData || !Object.keys(taskData).length) {
				throw new BadRequestException({
					success: false,
					code: HttpStatus.BAD_REQUEST,
					message: 'No values to update',
				});
			}
			await this.taskService.updateTask(taskData, userId, taskId);

			return { success: true, code: HttpStatus.OK, message: 'Task updated successfully' };
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(
				{
					success: false,
					code: HttpStatus.INTERNAL_SERVER_ERROR,
					message: `Something went wrong when updating the task: ${error.message || 'Unknown error'}`,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Delete(':id')
	async deleteTask(@Param('id') taskId: string, @UserID() userId: string) {
		try {

			await this.taskService.deleteTask(userId, taskId);

			return { success: true, code: HttpStatus.OK, message: 'Task deleted successfully' };
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(
				{
					success: false,
					code: HttpStatus.INTERNAL_SERVER_ERROR,
					message: `Something went wrong when deleting the task: ${error.message || 'Unknown error'}`,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
