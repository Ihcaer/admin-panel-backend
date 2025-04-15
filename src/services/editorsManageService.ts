import { IEditor, IEditorBase } from "../models/editorModel.js";
import EditorRepository from "../repositories/editorRepository.js";
import { hashInWorker } from "../utils/bcryptUtils.js";
import crypto from "crypto";
import { RegistrationData } from "./emailService.js";

export const generateCode = (length: number = 10): string => crypto.randomBytes(length).toString('hex');

class EditorsManageService {
   constructor(private editorRepository: EditorRepository) { }

   async createEditorAndGetLoginCode(editor: IEditorBase): Promise<string> {
      try {
         let code: string;
         let uniqueCode: boolean;

         do {
            code = generateCode();
            uniqueCode = await this.editorRepository.checkIsEditorExistsByLoginCode(code);
         } while (uniqueCode);

         editor.loginCode = code;
         await this.editorRepository.createEditor(editor);

         return code;
      } catch (error) {
         throw error;
      }
   }

   async setPasswordByLoginCode(loginCode: string, password: string): Promise<void> {
      try {
         const hashedPassword: string = await hashInWorker(password, 16);
         await this.editorRepository.setEditorPasswordByLoginCode(loginCode, hashedPassword);
      } catch (error) {
         throw error;
      }
   }

   async getLoginCode(id: string): Promise<RegistrationData | null> {
      try {
         let loginCode: RegistrationData | null = await this.editorRepository.findEmailAndLoginCodeById(id);
         return loginCode;
      } catch (error) {
         throw error;
      }
   }

   async getAllEditors(): Promise<IEditor[]> {
      try {
         return this.editorRepository.showAllEditorsDetails();
      } catch (error) {
         throw error;
      }
   }
}

export default EditorsManageService;