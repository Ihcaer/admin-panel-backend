import test, { afterEach, beforeEach, describe, mock } from "node:test";
import EditorService from "../../../src/user/editors/editor/editorService.js";
import { EditorRepositoryMock } from "../mock/editorRepositoryMock.js";
import { EditorRefreshRepositoryMock } from "../mock/editorRefreshTokenRepositoryMock.js";
import assert from 'node:assert/strict';
import EditorRepository from "../../../src/user/editors/editor/editorRepository.js";
import EditorRefreshTokenRepository from "../../../src/user/editors/refresh-tokens/editorRefreshTokenRepository.js";


import crypto from "crypto";
import { generateToken, IJwtPayload, verifyToken } from "../../../src/shared/utils/jwtUtils.js";
import { StoredRefreshToken, StoredRefreshTokenBase } from "../../../src/user/common/interfaces/storedRefreshTokenInterface.js";
import { ILimitedUserDetails } from "../../../src/user/common/types/userTypes.js";
import { generateCode } from "../../../src/shared/utils/commonUtils.js";

describe('Editor service', () => {
   let editorService: EditorService;
   let mockEditorRepository: EditorRepository;
   let mockEditorRefreshTokenRepository: EditorRefreshTokenRepository;

   let idPrefix: string;

   beforeEach(() => {
      // console.log("\n--- Test Start ---");
      mockEditorRepository = new EditorRepositoryMock();
      mockEditorRefreshTokenRepository = new EditorRefreshRepositoryMock();
      editorService = new EditorService(mockEditorRepository, mockEditorRefreshTokenRepository);

      idPrefix = "5f9f1b9b9c9c1b000000000";
   });

   /* afterEach(() => {
      console.log("--- Test End ---");
   }); */

   // Inherited class methods

   test('generateToken and generateTokens should generate tokens correctly', async () => {
      const payload: IJwtPayload = { id: "testId", username: "testUsername" };

      // Test tokens
      const testAccessToken: string = await editorService.generateToken(payload, { type: "access" });
      const testRefreshToken: string = await editorService.generateToken(payload, { type: "refresh" });
      const testAccessTokenPayload: IJwtPayload = await verifyToken(testAccessToken, { type: "access" });
      const testRefreshTokenPayload: IJwtPayload = await verifyToken(testRefreshToken, { type: "refresh" });
      const testTokenPayloadTable: IJwtPayload[] = [testAccessTokenPayload, testRefreshTokenPayload];

      // Control tokens
      const controlAccessToken: string = await generateToken(payload, { type: "access" });
      const controlRefreshToken: string = await generateToken(payload, { type: "refresh" });
      const controlAccessPayload: IJwtPayload = await verifyToken(controlAccessToken, { type: "access" });
      const controlRefreshPayload: IJwtPayload = await verifyToken(controlRefreshToken, { type: "refresh" });
      const controlTokenPayloadTable: IJwtPayload[] = [controlAccessPayload, controlRefreshPayload];

      assert.deepStrictEqual(testTokenPayloadTable, controlTokenPayloadTable);
   });

   test('hashToken should hash token correctly', async () => {
      const token: string = "testToken";
      const hashedToken: string = await editorService.hashToken(token);
      const hashedControlToken: string = crypto.createHash("sha256").update(token).digest("hex");

      assert.deepStrictEqual(hashedToken, hashedControlToken);
   });

   // Editor class

   test('replaceRefreshTokenInDB should correct replace refresh token in db', async () => {
      console.log("--- Replace refresh token in db test started ---");
      const tokenIndex: number = 1;
      const tokenId: string = idPrefix + tokenIndex;
      const newToken: string = "newTestToken" + tokenIndex;
      await editorService.replaceRefreshTokenInDB(tokenId, newToken);
      console.log("--- Replace refresh token in db test ended ---\n");
   });

   test('saveRefreshTokenInDB should create refresh token record in db', async () => {
      console.log("--- Save refresh token in db test started ---");
      const tokenIndex: string = "9";
      const tokenCredentials: StoredRefreshTokenBase = { hashedToken: "testToken" + tokenIndex, userId: tokenIndex };
      await editorService.saveRefreshTokenInDB(tokenCredentials);
      console.log("--- Save refresh token in db test ended ---\n");
   });

   test('getRefreshTokenCredentialsFromDB should return correct refresh token credentials', async () => {
      const token: string = "testToken";
      const userIndex: number = 1;

      const result: StoredRefreshToken = await editorService.getRefreshTokenCredentialsFromDB(token);

      assert.deepStrictEqual({ hashedToken: result.hashedToken, userId: result.userId.toString() }, { hashedToken: token, userId: idPrefix + userIndex });
   });

   test('getUserCredentialsByEmail should return correct user id, username, password, permissions', async () => {
      const editorIndex: number = 1;
      const email: string = `test${editorIndex}@email.com`
      const result: ILimitedUserDetails = await editorService.getUserCredentialsByEmail(email);

      assert.deepStrictEqual(result, { id: idPrefix + editorIndex, username: "testUsername" + editorIndex, password: "testPassword", permissions: 3 });
   });

   test('getUserJwtCredentialsById should return correct username and permissions', async () => {
      const editorIndex: number = 1;
      const id: string = idPrefix + editorIndex;
      const result: IJwtPayload = await editorService.getUserJwtCredentialsById(id);

      assert.deepStrictEqual(result, { id, username: "testUsername" + editorIndex, permissions: 3 });
   });

   test('checkEditorPermissions should return true if permissions are correct, false otherwise', async () => {
      const editorIndex: number = 1;
      const id: string = idPrefix + editorIndex;
      const userPermissions: number = 3;

      const result: boolean = await editorService.checkEditorPermissions(id, userPermissions);

      assert.deepStrictEqual(result, true);
   });

   test('saveLoginCodeInDB should save passwordResetCode correctly', async () => {
      const editorIndex: number = 1;
      const passwordResetCode: string = generateCode();

      try {
         await editorService.saveLoginCodeInDB(editorIndex.toString(), passwordResetCode);
         assert.ok(true, "Method should not throw error");
      } catch (error) {
         assert.fail('Method threw an error: ' + error.message);
      }
   });
});