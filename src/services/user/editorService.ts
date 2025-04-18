import { AbstractUserService } from "./abstractUserService.js";
import { EditorUsernameAndPermits, ILimitedUserDetails } from "../../types/userTypes.js";
import EditorRepository from "../../repositories/editorRepository.js";
import EditorRefreshTokenRepository from "../../repositories/editorRefreshTokenRepository.js";
import { UserNotFoundInDatabaseError } from "../../errors/userErrors.js";
import { IJwtPayload } from "../../utils/jwtUtils.js";
import { StoredRefreshToken, StoredRefreshTokenBase } from "../../interfaces/storedRefreshTokenInterface.js";
import { JwtRefreshTokenNotFoundError } from "../../errors/jwtCustomErrors.js";
import { AdminPanelPermissions } from "../../middlewares/adminPanelPermissionsMiddleware.js";
import { generateCode } from "../../utils/commonUtils.js";
import { hashInWorker } from "../../utils/bcryptUtils.js";
import { CriticalError } from "../../errors/indexErrors.js";

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

   async setPassword(filter: string, password: string, type: "registration" | "reset" | "change"): Promise<void> {
      try {
         const hashedPassword: string = await hashInWorker(password, 16);

         switch (type) {
            case "registration":
               await this.editorRepository.setEditorPasswordByLoginCode(filter, hashedPassword);
               break;
            case "reset":
               await this.editorRepository.setEditorPasswordByPasswordResetCode(filter, hashedPassword);
               break;
            case "change":
               await this.editorRepository.setPasswordById(filter, hashedPassword);
            default:
               throw new CriticalError("Wrong password set type");
         }
      } catch (error) {
         throw error;
      }
   }

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

   async generateLoginCode(): Promise<string> {
      try {
         let code: string;
         let isCodeUnique: boolean;

         do {
            code = generateCode(8);
            isCodeUnique = await this.editorRepository.checkIsEditorExistsByLoginCode(code);
         } while (isCodeUnique);
         return code;
      } catch (error) {
         throw error;
      }
   }

   async saveLoginCodeInDB(userId: string, code: string): Promise<void> {
      try {
         await this.editorRepository.saveEditorLoginCode(userId, code);
      } catch (error) {
         throw error;
      }
   }
}

export default EditorService;