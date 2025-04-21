import { CriticalError } from "../../../shared/error/indexErrors.js";
import { RegistrationData } from "../../../shared/services/emailService.js";
import { generateCode } from "../../../shared/utils/commonUtils.js";
import { UserNotFoundInDatabaseError } from "../../common/errors/userErrors.js";
import { AdminPanelPermissions } from "../middleware/adminPanelPermissionsMiddleware.js";
import { IEditor, IEditorBase } from "../editor/editorModel.js";
import EditorRepository from "../editor/editorRepository.js";

class EditorsManageService {
   constructor(private editorRepository: EditorRepository) { }

   // Editor creation
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

   // Get editor data

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

   // Editor modification

   async changePermissions(id: string, newPermissions: number): Promise<void> {
      try {
         await this.editorRepository.replacePermissions(id, newPermissions)
      } catch (error) {
         throw error;
      }
   }

   async changeUsername(id: string, newUsername: string): Promise<void> {
      try {
         await this.editorRepository.replaceUsername(id, newUsername);
      } catch (error) {
         throw error;
      }
   }

   // Utility methods

   getAllPermissionsArray(): string[] {
      const permissionsArray: string[] = Object.keys(AdminPanelPermissions).filter(key => isNaN(Number(key)) && key !== "SUPER_ADMIN");
      return permissionsArray;
   }

   async adaptPermissions(permissions: string[]): Promise<number> {
      return permissions.reduce((accumulator, currentPermission) => {
         if (!(currentPermission in AdminPanelPermissions)) throw new CriticalError("Invalid permissions: " + currentPermission);
         const permissionValue: number = AdminPanelPermissions[currentPermission as keyof typeof AdminPanelPermissions];
         if (permissionValue === AdminPanelPermissions.SUPER_ADMIN) throw new CriticalError("Can't add super admin permission");
         return accumulator + permissionValue;
      }, 0);
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
}

export default EditorsManageService;