import { Request, Response, NextFunction } from "express";
import { addError, clearState, getState, isErrorRegistered } from '../src/shared/store/store.js';
import EmailService from "./shared/services/emailService.js";
import { CustomError, NonCriticalError } from '../src/shared/error/indexErrors.js';
import jwt from 'jsonwebtoken';

let timerId: NodeJS.Timeout | null = null;
let lastEmailSent: number | null = null;

const reportError = (error: string): void => {
   const emailService = new EmailService();
   const now: number = Date.now();
   const isErrorLogged: boolean = isErrorRegistered(error);

   if ((lastEmailSent && now - lastEmailSent < 24 * 60 * 60 * 1000) || isErrorLogged) return;

   addError(error);

   if (timerId) clearTimeout(timerId);

   timerId = setTimeout(() => {
      emailService.sendErrorEmail(getState().errors);
      clearState("errors");
      timerId = null;
   }, 10 * 60 * 1000);
};

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
   console.error(err.stack);

   if (!(err instanceof NonCriticalError) || !(err instanceof jwt.TokenExpiredError)) reportError(err.message);

   if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
   } else if (err instanceof jwt.TokenExpiredError || err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Authorization failed" });
   } else {
      res.status(500).json({ message: err.message });
   }
}

export default errorHandler;