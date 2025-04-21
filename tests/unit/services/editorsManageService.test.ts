import { beforeEach, describe, it } from "node:test";
import EditorRepository from "../../../src/user/editors/editor/editorRepository.js";
import EditorsManageService from "../../../src/user/editors/editors-manage/editorsManageService.js";
import { EditorRepositoryMock } from "../mock/editorRepositoryMock.js";
import { AdminPanelPermissions } from "../../../src/user/editors/middleware/adminPanelPermissionsMiddleware.js";
import assert from 'node:assert/strict';

describe('EditorsManageService', () => {
   let editorsManageService: EditorsManageService;
   let mockEditorRepository: EditorRepository;

   beforeEach(() => {
      mockEditorRepository = new EditorRepositoryMock();
      editorsManageService = new EditorsManageService(mockEditorRepository);
   });

   describe('getAllPermissionsArray', () => {
      it('should return table with all permissions', async () => {
         const permissionsTable: string[] = ["EDITORS_MANAGE"];
         const result: string[] = editorsManageService.getAllPermissionsArray();
         assert.deepStrictEqual(result, permissionsTable);
      });
   });

   describe('adaptPermissions', () => {
      it('should return correctly converted permission number', async () => {
         const permissionsArray: (keyof typeof AdminPanelPermissions)[] = ['EDITORS_MANAGE'];
         const result: number = await editorsManageService.adaptPermissions(permissionsArray);
         assert.deepStrictEqual(result, AdminPanelPermissions.EDITORS_MANAGE);
      });

      it('should throw error if permission value is SUPER_ADMIN', async () => {
         const permissionsArray: (keyof typeof AdminPanelPermissions)[] = ['EDITORS_MANAGE', 'SUPER_ADMIN'];

         try {
            const result: number = await editorsManageService.adaptPermissions(permissionsArray);
            assert.fail("Method should throw an error");
         } catch (error) {
            assert.ok(true, "Method threw an error: " + error.message);
         }
      });
   });

   describe('changePermissions', () => {
      it('should replace permissions correctly', async () => {
         console.log("--- Changing permissions test started ---");
         const editorIndex: string = "1";
         const editorNewPermissions: number = 1;
         try {
            await editorsManageService.changePermissions(editorIndex, editorNewPermissions);
            assert.ok(true, "Permissions changed");
         } catch (error) {
            assert.fail("Method threw an error: " + error.message);
         }
         console.log("--- Changing permissions test test ended ---\n");
      });
   });

   describe('changeUsername', () => {
      it('should replace username correctly', async () => {
         console.log("--- Changing username test started ---");
         const editorIndex: string = "1";
         const editorNewUsername: string = "newUsername";
         try {
            await editorsManageService.changeUsername(editorIndex, editorNewUsername);
            assert.ok(true, "Username changed");
         } catch (error) {
            assert.fail("Method threw an error: " + error.message);
         }
         console.log("--- Changing username test test ended ---\n");
      });
   });
});