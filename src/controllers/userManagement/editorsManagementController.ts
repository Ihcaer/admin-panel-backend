import { Request, Response, NextFunction } from "express";
import { IEditor, IEditorBase } from "../../models/editorModel.js";
import EditorsManageService from "../../services/editorsManageService.js";
import EmailService, { RegistrationData } from "../../services/emailService.js";
import { AuthenticationError, NoUserDataError, UserNotFoundInDatabaseError } from "../../errors/userErrors.js";

interface IErrorResponse {
   status: string;
   message: string;
}

class EditorsManagementController {
   constructor(private editorsManageService: EditorsManageService, private emailService: EmailService) { }

   errorResponse(message: string): IErrorResponse {
      return { status: "error", message };
   }

   async createEditor(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const editor: IEditorBase = req.body;
         if (!editor) throw new NoUserDataError();

         const loginCode: string = await this.editorsManageService.createEditorAndGetLoginCode(editor);

         const emailData: RegistrationData = { emailTo: editor.email, code: loginCode };
         await this.emailService.sendRegistrationEmail(emailData);

         res.status(201).json({ message: "Editor created" });
      } catch (error) {
         next(error);
      }
   }

   async resendEmailWithLoginCode(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const id: string = req.body.id;
         const resendData: RegistrationData = await this.editorsManageService.getLoginCode(id);

         if (!resendData) {
            throw new UserNotFoundInDatabaseError("editor");
         }
         if (!resendData?.code) {
            throw new AuthenticationError();
         }

         this.emailService.sendRegistrationEmail(resendData);

         res.status(200).json({ message: "E-mail sended" });
      } catch (error) {
         next(error);
      }
   }

   async showAllUsernames(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const editors: IEditor[] = await this.editorsManageService.getAllEditors();

         res.status(200).json({ editors });
      } catch (error) {
         next(error);
      }
   }
}

export default EditorsManagementController;