import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectToMongoDB } from './shared/dbConnect';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: 'http://localhost:3000',
	});
	await connectToMongoDB();
	await app.listen(3030);
}

void bootstrap();
