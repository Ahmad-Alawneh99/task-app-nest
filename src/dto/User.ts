export default class UserDTO {
	id?: string; // present only when retrieving from the database
	name: string;
	email: string;
    password?: string; // present only when signing up
}
