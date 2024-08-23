import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import UserDTO from 'src/dto/User';
import User from '../models/user';

@Injectable()
export class UserService {
	async createUser(userData: UserDTO) {
		try {
			const hashedPassword = await bcrypt.hash(userData.password, 16);
			const user = new User({ email: userData.email, password: hashedPassword, name: userData.name });
			await user.save();
		} catch (error) {
			if (error.code === 11000) {
				throw new ConflictException({ success: false, code: HttpStatus.CONFLICT, message: 'Email already exists.' });
			} else {
				throw error;
			}
		}
	}

	async signIn(userData: UserDTO) {
		const user = await User.findOne({ email: userData.email });
		if (!user) {
			throw new BadRequestException({ success: false, code: HttpStatus.BAD_REQUEST, message: 'Invalid email or password.' });
		}
		const isPasswordValid = await bcrypt.compare(userData.password, user.password);
		if (!isPasswordValid) {
			throw new BadRequestException({ success: false, code: HttpStatus.BAD_REQUEST, message: 'Invalid email or password.' });
		}

		return user;
	}

	async getProfile(userId: string) {
		const user = await User.findOne({ _id: userId });
		if (!user) {
			throw new BadRequestException({ success: false, code: HttpStatus.BAD_REQUEST, message: 'Profile info not found' });
		}

		user.password = ''; // do not return password with the response

		return user;
	}
}
