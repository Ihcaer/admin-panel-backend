import { IUserController } from "../../interfaces/userInterfaces.js";
import { Request, Response, NextFunction } from "express";
import EditorService from "../../services/user/editorService.js";
import { ILoginCredentials, ILoginTokens } from "../../types/userTypes.js";
import jwt from "jsonwebtoken";
import { MissingLoginCredentialsError } from "../../errors/userErrors.js";
import { JwtNoTokenError } from "../../errors/jwtCustomErrors.js";

class EditorController implements IUserController {
   constructor(private editorService: EditorService) { }

   async login(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const loginCredentials: ILoginCredentials = req.body;

         if (!loginCredentials.email || !loginCredentials.password) {
            throw new MissingLoginCredentialsError();
         }

         const tokens: ILoginTokens = await this.editorService.validateLogin(loginCredentials);

         res.status(200).json({ tokens });
      } catch (error) {
         next(error);
      }
   }

   async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const { token } = req.body;

         if (!token) throw new JwtNoTokenError();
         if (typeof token !== "string") throw new jwt.JsonWebTokenError("Token has wrong type");

         const tokens = await this.editorService.validateRefreshToken(token);

         res.status(200).json({ tokens });
      } catch (error) {
         if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: error.message });
         } else {
            next(error);
         }
      }
   }

   async remindPassword(req: Request, res: Response, next: NextFunction): Promise<void> { }
}

export default EditorController;