import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import * as tokenUtils from './tokenUtils';
import { ExtensibleRequest } from './types';

@Injectable()
export class UserMiddleware implements NestMiddleware {
	use(req: ExtensibleRequest, res: Response, next: NextFunction) {
		try {
			const cookies = req.headers.cookie || '';
			const taskAppToken = cookies.split(';').find((cookie) => cookie.trim().startsWith('task_app_token'))?.split('=')[1] || '';
			const validatedToken = tokenUtils.verifyToken(taskAppToken) as JwtPayload;

			req.userId = validatedToken.id as string;

			return next();
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			return res.status(HttpStatus.UNAUTHORIZED).send({ success: false, code: HttpStatus.UNAUTHORIZED, message: 'Authentication required' });
		}
	}
}
