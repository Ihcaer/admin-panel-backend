import { IUserController } from "../../interfaces/userInterfaces.js";
import { Request, Response, NextFunction } from "express";
import EditorService from "../../services/user/editorService.js";
import { ILoginCredentials, ILoginTokens } from "../../types/userTypes.js";
import { AuthenticationError, MissingLoginCredentialsError } from "../../errors/userErrors.js";
import EmailService from "../../services/emailService.js";

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

         res.status(200).json({ message: "E-mail with password reset link sent" });
      } catch (error) {
         next(error);
      }
   }

   async confirmPasswordChangeFromReminder(req: Request, res: Response, next: NextFunction): Promise<void> {
      const { passwordResetCode, password }: { passwordResetCode: string, password: string } = req.body;
      try {
         if (!passwordResetCode || !password) throw new AuthenticationError();
         await this.editorService.setPassword(passwordResetCode, password, "reset");
      } catch (error) {
         next(error);
      }
   }

   async confirmEditorAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
      const { loginCode, password } = req.body;
      try {
         if (!loginCode || !password) throw new AuthenticationError();
         await this.editorService.setPassword(loginCode, password, "registration");
         res.status(200);
      } catch (error) {
         next(error);
      }
   }
}

export default EditorController;