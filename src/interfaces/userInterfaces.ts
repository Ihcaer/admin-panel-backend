import { Request, Response, NextFunction } from "express";

export interface IUserController {
   login(req: Request, res: Response, next: NextFunction): Promise<void>;
   remindPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
   confirmPasswordChangeFromReminder(req: Request, res: Response, next: NextFunction): Promise<void>;
}