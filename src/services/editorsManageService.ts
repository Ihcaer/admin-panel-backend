import { CriticalError } from "../errors/indexErrors.js";
import { UserNotFoundInDatabaseError } from "../errors/userErrors.js";
import { AdminPanelPermissions } from "../middlewares/adminPanelPermissionsMiddleware.js";
import { IEditor, IEditorBase } from "../models/editorModel.js";
import EditorRepository from "../repositories/editorRepository.js";
import { generateCode } from "../utils/commonUtils.js";
import { RegistrationData } from "./emailService.js";

class EditorsManageService {
   constructor(private editorRepository: EditorRepository) { }

   getAllPermissionsArray(): string[] {
      const permissionsArray: string[] = Object.keys(AdminPanelPermissions).filter(key => isNaN(Number(key)) && key !== "SUPER_ADMIN");
      return permissionsArray;
   }

   async adaptPermissions(permissions: string[]): Promise<number> {
      return permissions.reduce((accumulator, currentPermission) => {
         if (!(currentPermission in AdminPanelPermissions)) throw new CriticalError("Wrong permission");
         const permissionValue: number = AdminPanelPermissions[currentPermission as keyof typeof AdminPanelPermissions];
         if (permissionValue === AdminPanelPermissions.SUPER_ADMIN) throw new CriticalError("Can't add super admin permission");
         return accumulator + permissionValue;
      }, 0);
   }

   async createEditorAndGetLoginCode(editor: IEditorBase): Promise<string> {
      try {
         let code: string;

         code = editor.loginCode = await this.generateLoginCode();
         await this.editorRepository.createEditor(editor);

         return code;
      } catch (error) {
         throw error;
      }
   }

   async generateLoginCode(): Promise<string> {
      let code: string;
      let isCodeUnique: boolean;

      do {
         code = generateCode(10);
         isCodeUnique = await this.editorRepository.checkIsEditorExistsByLoginCode(code);
      } while (isCodeUnique);

      return code;
   }

   async getLoginCode(id: string): Promise<RegistrationData> {
      try {
         let loginCode: RegistrationData;

         const editorEmail: string | null = await this.editorRepository.findEmailById(id);
         if (!editorEmail) throw new UserNotFoundInDatabaseError("editor");
         const code: string = await this.generateLoginCode();

         loginCode = { emailTo: editorEmail, code };

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