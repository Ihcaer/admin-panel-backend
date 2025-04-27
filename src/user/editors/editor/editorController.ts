import { IUserController } from "../../common/interfaces/userInterfaces.js";
import { Request, Response, NextFunction } from "express";
import EditorService from "./editorService.js";
import { ILoginCredentials, ILoginTokens } from "../../common/types/userTypes.js";
import EmailService from "../../../shared/services/emailService.js";
import { AuthenticationError, MissingLoginCredentialsError, NoUserDataError } from "../../common/errors/userErrors.js";

class EditorController implements IUserController {
   constructor(private editorService: EditorService, private emailService: EmailService) { }

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

   async remindPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
      const email: string = req.body.email;
      let loginCode: string;

      try {
         if (!email) throw new MissingLoginCredentialsError();

         loginCode = await this.editorService.handleNewLoginCode(email);
         await this.emailService.sendPasswordResetEmail(email, loginCode);

         res.status(200).send("E-mail with password reset link sent");
      } catch (error) {
         next(error);
      }
   }

   async confirmPasswordChangeFromReminder(req: Request, res: Response, next: NextFunction): Promise<void> {
      const { passwordResetCode, password }: { passwordResetCode: string, password: string } = req.body;
      try {
         if (!passwordResetCode || !password) throw new AuthenticationError();
         await this.editorService.setPassword(passwordResetCode, password, "reset");

         res.status(200).send("Password changed");
      } catch (error) {
         next(error);
      }
   }

   async confirmEditorAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
      const { loginCode, password } = req.body;
      try {
         if (!loginCode || !password) throw new AuthenticationError();
         await this.editorService.setPassword(loginCode, password, "registration");
         res.sendStatus(200);
      } catch (error) {
         next(error);
      }
   }

   async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
      const { id, newPassword }: { id: string, newPassword: string } = req.body;
      try {
         if (!newPassword) throw new NoUserDataError();

         await this.editorService.setPassword(id, newPassword, "change");
         res.status(200).send("Password changed");
      } catch (error) {
         next(error);
      }
   }
}

export default EditorController;