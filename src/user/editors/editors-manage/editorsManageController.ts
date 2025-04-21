import { Request, Response, NextFunction } from "express";
import EditorsManageService from "./editorsManageService.js";
import EmailService, { RegistrationData } from "../../../shared/services/emailService.js";
import { AuthenticationError, NoUserDataError, UserNotFoundInDatabaseError } from "../../common/errors/userErrors.js";
import { IEditor, IEditorBase } from "../editor/editorModel.js";

class EditorsManageController {
   constructor(private editorsManageService: EditorsManageService, private emailService: EmailService) { }

   async createEditor(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         if (!req.body.permission || !(Array.isArray(req.body.permission) && req.body.permission.every((item: string) => typeof item === 'string'))) throw new NoUserDataError();

         req.body.permission = await this.editorsManageService.adaptPermissions(req.body.permissions);
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

   async sendAllPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const permissions: string[] = this.editorsManageService.getAllPermissionsArray();
         res.status(200).json({ permissions });
      } catch (error) {
         next(error);
      }
   }

   async changeEditorPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
      const { id, permissions }: { id: string, permissions: string[] } = req.body;
      try {
         if (!id || !permissions || !Array.isArray(permissions)) throw new NoUserDataError();

         const newPermissions: number = await this.editorsManageService.adaptPermissions(permissions);
         await this.editorsManageService.changePermissions(id, newPermissions);

         res.status(200);
      } catch (error) {
         next(error);
      }
   }

   async changeEditorUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
      const { id, username }: { id: string, username: string } = req.body;
      try {
         if (!id || !username) throw new NoUserDataError();
         await this.editorsManageService.changeUsername(id, username);
         res.status(200);
      } catch (error) {
         next(error);
      }
   }
}

export default EditorsManageController;