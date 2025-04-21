import { Request, Response, NextFunction } from "express";
import { getRestState } from "../store/store.js";

const restMiddleware = (req: Request, res: Response, next: NextFunction) => {
   const requestType: string = req.method.toLowerCase();
   if (getRestState(requestType)) {
      next();
   } else {
      res.status(503).json({ message: "Request unavailable" });
   }
}

export default restMiddleware;