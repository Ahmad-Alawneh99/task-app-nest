import { Request } from "express";

export interface ExtensibleRequest extends Request {
	userId: string;
}
