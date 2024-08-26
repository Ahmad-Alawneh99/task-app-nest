import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectToMongoDB } from './shared/dbConnect';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: 'http://localhost:3000',
	});
	await connectToMongoDB();
	await app.listen(3030);
}

void bootstrap();
