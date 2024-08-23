import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
	constructor() {}

	@Get()
	rootRoute(): string {
		return 'Task manager API';
	}
}
