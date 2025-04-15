import { Request, Response, NextFunction } from "express";
import { IEditor, IEditorBase } from "../../models/editorModel.js";
import EditorsManageService from "../../services/editorsManageService.js";
import EmailService, { RegistrationData } from "../../services/emailService.js";

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
         const loginCode: string = await this.editorsManageService.createEditorAndGetLoginCode(editor);

         const emailData: RegistrationData = { emailTo: editor.email, code: loginCode };
         await this.emailService.sendRegistrationEmail(emailData);

         res.status(201);
      } catch (error) {
         next(error);
      }
   }

   async confirmEditorAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const { loginCode, password } = req.body;
         await this.editorsManageService.setPasswordByLoginCode(loginCode, password);
         res.status(200);
      } catch (error) {
         next(error);
      }
   }

   async resendEmailWithLoginCode(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const id: string = req.body.id;
         const resendData: RegistrationData | null = await this.editorsManageService.getLoginCode(id);

         if (!resendData) {
            res.status(404).json(this.errorResponse("Editor not found"));
         }
         if (!resendData?.code) {
            res.status(404).json(this.errorResponse("Editor's login code not found"));
         }

         this.emailService.sendRegistrationEmail(resendData!);

         res.status(200);
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