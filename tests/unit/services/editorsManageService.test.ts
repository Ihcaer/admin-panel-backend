import { beforeEach, describe, it } from "node:test";
import EditorRepository from "../../../src/repositories/editorRepository.js";
import EditorsManageService from "../../../src/services/editorsManageService.js";
import { EditorRepositoryMock } from "../mock/editorRepositoryMock.js";
import { AdminPanelPermissions } from "../../../src/middlewares/adminPanelPermissionsMiddleware.js";
import assert from 'node:assert/strict';

describe('EditorsManageService', () => {
   let editorsManageService: EditorsManageService;
   let mockEditorRepository: EditorRepository;

   beforeEach(() => {
      mockEditorRepository = new EditorRepositoryMock();
      editorsManageService = new EditorsManageService(mockEditorRepository);
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
});