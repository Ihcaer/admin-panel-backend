import { EditorUsernameAndPermits, ILimitedUserDetails } from "../../common/types/userTypes.js";
import Editor, { IEditor, IEditorBase } from "./editorModel.js";


class EditorRepository {
   async createEditor(editor: IEditorBase): Promise<void> {
      await Editor.create(editor);
   }

   // Find

   async findEmailById(id: string): Promise<string | null> {
      return Editor.findById(id, 'email -_id');
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

   // Set

   async setEditorPasswordByLoginCode(loginCode: string, password: string): Promise<void> {
      await Editor.updateOne({ loginCode }, { $set: { password }, $unset: { loginCode } });
   }

   async setEditorPasswordByPasswordResetCode(passwordResetCode: string, password: string): Promise<void> {
      await Editor.updateOne({ passwordResetCode }, { $set: { password }, $unset: { passwordResetCode } });
   }

   async setPasswordById(id: string, password: string): Promise<void> {
      await Editor.updateOne({ _id: id }, { password });
   }

   async saveEditorLoginCode(id: string, code: string): Promise<void> {
      await Editor.updateOne({ _id: id }, { passwordResetCode: code });
   }

   // Replace

   async replacePermissions(id: string, newPermissions: number): Promise<void> {
      await Editor.updateOne({ _id: id }, { permissions: newPermissions });
   }

   async replaceUsername(id: string, newUsername: string): Promise<void> {
      await Editor.updateOne({ _id: id }, { username: newUsername });
   }

   // Check

   async checkIsEditorExistsByLoginCode(loginCode: string): Promise<boolean> {
      const exists: boolean = !!(Editor.exists({ loginCode }));
      return exists;
   }
}

export default EditorRepository;