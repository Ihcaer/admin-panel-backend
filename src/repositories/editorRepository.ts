import Editor, { IEditor, IEditorBase } from "../models/editorModel.js";
import { RegistrationData } from "../services/emailService.js";
import { EditorUsernameAndPermits, ILimitedUserDetails } from "../types/userTypes.js";

class EditorRepository {
   async createEditor(editor: IEditorBase): Promise<void> {
      await Editor.create(editor);
   }

   async checkIsEditorExistsByLoginCode(loginCode: string): Promise<boolean> {
      const exists: boolean = !!(Editor.exists({ loginCode }));
      return exists;
   }

   async setEditorPasswordByLoginCode(loginCode: string, password: string): Promise<void> {
      await Editor.updateOne({ loginCode }, { password });
   }

   async findEmailAndLoginCodeById(id: string): Promise<RegistrationData | null> {
      return Editor.findById(id, 'email loginCode -_id');
   }

   async showAllEditorsDetails(): Promise<IEditor[]> {
      return Editor.find({}, 'username email permits');
   }

   async findEditorCredentialsByEmail(email: string): Promise<ILimitedUserDetails | null> {
      return Editor.findOne({ email }, 'username permits password');
   }

   async findUsernameAndPermitsById(id: string): Promise<EditorUsernameAndPermits | null> {
      return Editor.findById(id, '-_id username permits');
   }

   async findEditorPermissionsById(id: string): Promise<number | null> {
      return Editor.findById(id, '-_id permissions');
   }
}

export default EditorRepository;