import { Types } from "mongoose";
import Editor, { IEditor, IEditorBase } from "../../../src/models/editorModel.js";
import { RegistrationData } from "../../../src/services/emailService.js";
import { EditorUsernameAndPermits, ILimitedUserDetails } from "../../../src/types/userTypes.js";

export class EditorRepositoryMock {
   editors: IEditor[] = [];
   idPrefix: string = "5f9f1b9b9c9c1b000000000";

   constructor() {
      for (let i = 0; i < 3; i++) {
         const editor = new Editor({ _id: Types.ObjectId.createFromHexString(this.idPrefix + i), username: `testUsername${i}`, email: `test${i}@email.com`, permissions: 3, password: "testPassword", });
         this.editors.push(editor);
      };
   }

   async createEditor(editor: IEditorBase): Promise<void> {
      const newEditor = new Editor({ editor });
      console.log("Editor created:", newEditor);
   }

   async checkIsEditorExistsByLoginCode(loginCode: string): Promise<boolean> {
      let exists: boolean;

      if (loginCode) {
         exists = true;
      } else {
         exists = false;
      }

      return exists;
   }

   async setEditorPasswordByLoginCode(loginCode: string, password: string): Promise<void> {
      console.log("Password set:", { loginCode, password });
   }

   async findEmailAndLoginCodeById(id: string): Promise<RegistrationData | null> {
      const editor: IEditor = this.editors.find(editor => editor._id === id);
      const data: RegistrationData | null = editor ? { emailTo: editor.email, code: "testCode" } : null;
      return data;
   }

   async showAllEditorsDetails(): Promise<IEditor[]> {
      const editorsDetails: IEditor[] = this.editors.map(editor => {
         const updatedEditor = { ...editor.toObject() };
         delete updatedEditor.password;
         return updatedEditor;
      });

      return editorsDetails;
   }

   async findEditorCredentialsByEmail(email: string = "test0@email.com"): Promise<ILimitedUserDetails | null> {
      const editor = this.editors.find(editor => editor.email === email);
      const editorCredentials: ILimitedUserDetails | null = editor
         ? {
            id: editor.id,
            username: editor.username,
            permissions: editor.permissions,
            password: editor.password
         }
         : null;

      return editorCredentials;
   }

   async findUsernameAndPermitsById(id: string = this.idPrefix + 0): Promise<EditorUsernameAndPermits | null> {
      const editor: IEditor = this.editors.find(editor => editor.id === id);
      const editorData: EditorUsernameAndPermits | null = editor ? { username: editor.username, permissions: editor.permissions } : null;
      return editorData;
   }

   async findEditorPermissionsById(id: string = this.idPrefix + 0): Promise<number | null> {
      const editor: IEditor = this.editors.find(editor => editor.id === id);
      const editorPermissions: number | null = editor ? editor.permissions : null;
      return editorPermissions;
   }
}