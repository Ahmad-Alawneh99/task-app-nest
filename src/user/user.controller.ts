import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import * as validationUtils from '../shared/validationUtils';
import * as tokenUtils from '../shared/tokenUtils';
import UserDTO from '../dto/User';
import { UserID } from 'src/shared/userId.decorator';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('sign-up')
	async signUp(@Body() userData: UserDTO) {
		try {
			if (!validationUtils.isValidEmail(userData.email)) {
				throw new BadRequestException({ success: false, code: HttpStatus.BAD_REQUEST, message: 'Email is missing or invalid.' });
			}

			if (!validationUtils.isStrongPassword(userData.password)) {
				throw new BadRequestException({ success: false, code: HttpStatus.BAD_REQUEST, message: 'Weak password.' });
			}

			const userId = await this.userService.createUser(userData);

			const token = tokenUtils.signToken({ id: userId, email: userData.email });

			return {
				success: true,
				code: HttpStatus.CREATED,
				message: 'User created successfully',
				token,
			};
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(
				{
					success: false,
					code: HttpStatus.INTERNAL_SERVER_ERROR,
					message: `Something went wrong when signing up: ${error.message || 'Unknown error'}`,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Post('sign-in')
	@HttpCode(200)
	async signIn(@Body() userData: UserDTO) {
		try {
			if (!userData.email.trim() || !userData.password.trim()) {
				throw new BadRequestException({ success: false, code: HttpStatus.BAD_REQUEST, message: 'Email and password are required.' });
			}

			const user = await this.userService.signIn(userData);

			const token = tokenUtils.signToken({ id: user.id, email: user.email });

			return {
				success: true,
				code: HttpStatus.OK,
				token,
			};
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(
				{
					success: false,
					code: HttpStatus.INTERNAL_SERVER_ERROR,
					message: `Something went wrong when signing in: ${error.message || 'Unknown error'}`,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('profile')
	async getProfile(@UserID() userId: string) {
		try {
			const user = await this.userService.getProfile(userId);

			return {
				success: true,
				code: HttpStatus.OK,
				user,
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
}
