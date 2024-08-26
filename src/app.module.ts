import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserMiddleware } from './shared/user.middleware';
import { TaskService } from './task/task.service';
import { TaskController } from './task/task.controller';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
	imports: [],
	controllers: [AppController, TaskController, UserController],
	providers: [TaskService, UserService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(UserMiddleware).forRoutes('tasks', 'users/profile');
	}
}
