import { TaskStatus } from "../shared/TaskStatus";

export default class TaskDTO {
	id?: string; // present only when retrieving from the database
	owner?: string; // present only when retrieving from the database
	title: string;
	description?: string;
	status: TaskStatus;
	dueDate: Date;
}
