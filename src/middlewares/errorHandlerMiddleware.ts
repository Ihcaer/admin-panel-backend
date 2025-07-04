import { Response } from 'express';
import { addError, clearState, getState, isErrorRegistered } from '../store/store.js';
import EmailService from '../services/emailService.js';
import { CustomError, NonCriticalError } from '../errors/indexErrors.js';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

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

const errorHandler = (err: Error, res: Response): void => {
   console.error(err.stack);

   if (!(err instanceof NonCriticalError) || !(err instanceof TokenExpiredError)) reportError(err.message);

   if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
   } else if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
      res.status(401).json({ message: "Authorization failed" });
   } else {
      res.status(500).json({ message: err.message });
   }
}

export default errorHandler;