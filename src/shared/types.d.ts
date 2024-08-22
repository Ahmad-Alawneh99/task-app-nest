import { Request } from "express";

export interface ExtensibleRequest extends Request {
    userId: string;
}

export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN PROGRESS',
    COMPLETED = 'COMPLETED',
};
