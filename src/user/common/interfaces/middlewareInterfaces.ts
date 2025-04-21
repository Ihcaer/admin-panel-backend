import { Request } from "express";

export interface AuthenticatedRequest extends Request {
   userId?: string;
   username?: string;
   userPermits?: number;
}