import { AbstractUserService } from "./abstractUserService.js";
import { EditorUsernameAndPermits, ILimitedUserDetails } from "../../types/userTypes.js";
import EditorRepository from "../../repositories/editorRepository.js";
import EditorRefreshTokenRepository from "../../repositories/editorRefreshTokenRepository.js";
import { UserNotFoundInDatabaseError } from "../../errors/userErrors.js";
import { IJwtPayload } from "../../utils/jwtUtils.js";
import { StoredRefreshToken, StoredRefreshTokenBase } from "../../interfaces/storedRefreshTokenInterface.js";
import { JwtRefreshTokenNotFoundError } from "../../errors/jwtCustomErrors.js";
import { AdminPanelPermissions } from "../../middlewares/adminPanelPermissionsMiddleware.js";

class EditorService extends AbstractUserService {
   constructor(private editorRepository: EditorRepository, private refreshTokenRepository: EditorRefreshTokenRepository) {
      super();
   }

   // Tokens db actions

   async replaceRefreshTokenInDB(oldTokenId: string, newToken: string): Promise<void> {
      const hashedNewToken: string = await this.hashToken(newToken);
      await this.refreshTokenRepository.replaceToken(oldTokenId, hashedNewToken);
   }

   async saveRefreshTokenInDB(tokenCredentials: StoredRefreshTokenBase): Promise<void> {
      try {
         await this.refreshTokenRepository.saveToken(tokenCredentials);
      } catch (error) {
         throw error;
      }
   }

   async getRefreshTokenCredentialsFromDB(hashedToken: string): Promise<StoredRefreshToken> {
      try {
         const refreshToken: StoredRefreshToken | null = await this.refreshTokenRepository.findToken(hashedToken);
         if (refreshToken === null) throw new JwtRefreshTokenNotFoundError();
         return refreshToken;
      } catch (error) {
         throw error;
      }
   }

   // Editor db actions

   async getUserCredentialsByEmail(email: string): Promise<ILimitedUserDetails> {
      try {
         const userCredentials: ILimitedUserDetails | null = await this.editorRepository.findEditorCredentialsByEmail(email);
         if (userCredentials === null) throw new UserNotFoundInDatabaseError("editor");
         return userCredentials;
      } catch (error) {
         throw error;
      }
   }

   async getUserJwtCredentialsById(id: string): Promise<IJwtPayload> {
      try {
         const editorCredentials: EditorUsernameAndPermits | null = await this.editorRepository.findUsernameAndPermitsById(id);
         if (editorCredentials === null) throw new UserNotFoundInDatabaseError("editor");
         const jwtCredentials: IJwtPayload = { id, username: editorCredentials.username, permissions: editorCredentials.permissions };

         return jwtCredentials;
      } catch (error) {
         throw error;
      }
   }

   async checkEditorPermissions(id: string, permissionToCheck: AdminPanelPermissions): Promise<boolean> {
      try {
         let outcome: boolean;

         const editorPermits: number | null = await this.editorRepository.findEditorPermissionsById(id);
         outcome = (editorPermits !== null && ((editorPermits & permissionToCheck) === editorPermits)) ? true : false;

         return outcome;
      } catch (error) {
         throw error;
      }
   }
}

export default EditorService;