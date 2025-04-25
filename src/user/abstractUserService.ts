import { verifyHashedData } from "../shared/utils/bcryptUtils.js";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { Types } from "mongoose";
import { LoginCredentialsIncorrectError } from "./common/errors/userErrors.js";
import { HashingTokenError } from "./common/errors/jwtCustomErrors.js";
import { ILimitedUserDetails, ILoginCredentials, ILoginTokens } from "./common/types/userTypes.js";
import { StoredRefreshToken, StoredRefreshTokenBase } from "./common/interfaces/storedRefreshTokenInterface.js";
import { generateToken, IJwtPayload, TokenType, verifyToken } from "../shared/utils/jwtUtils.js";

/**
 * Abstract service handling login operations.
 * Extended by editor and user service.
 */
export abstract class AbstractUserService {

   // Login actions

   async validateLogin(credentials: ILoginCredentials): Promise<ILoginTokens> {
      let response: ILoginTokens;
      try {
         const userCredentials: ILimitedUserDetails = await this.getUserCredentialsByEmail(credentials.email);
         const isPasswordValid: boolean = await this.#comparePasswords(credentials.password!, userCredentials.password!);
         delete credentials.password;
         delete userCredentials.password;

         if (isPasswordValid) {
            const tokens: ILoginTokens = await this.generateTokens(userCredentials);

            const hashedToken: string = await this.hashToken(tokens.refreshToken);
            const refreshToken: StoredRefreshTokenBase = { hashedToken, userId: userCredentials.id }
            await this.saveRefreshTokenInDB(refreshToken);

            response = tokens;
         } else {
            throw new LoginCredentialsIncorrectError();
         }

         return response;
      } catch (error) {
         throw error;
      }
   }

   async handleNewLoginCode(email: string): Promise<string> {
      let passwordResetCode: string;

      passwordResetCode = await this.generateLoginCode();
      await this.saveLoginCodeInDB(email, passwordResetCode);

      return passwordResetCode;
   }

   async #comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
      return verifyHashedData(password, hashedPassword);
   }

   // Refresh tokens operations

   async validateRefreshToken(refreshToken: string): Promise<ILoginTokens> {
      try {
         let response: ILoginTokens;

         const hashedToken: string = await this.hashToken(refreshToken);
         const dbRefreshToken: StoredRefreshToken = await this.getRefreshTokenCredentialsFromDB(hashedToken);

         const isTokenValid: boolean = await this.compareRefreshTokens(refreshToken, hashedToken, dbRefreshToken);

         if (isTokenValid) {
            const tokenPayload: IJwtPayload = await this.getUserJwtCredentialsById(dbRefreshToken.userId);
            response = await this.generateTokens(tokenPayload);
            await this.replaceRefreshTokenInDB(dbRefreshToken.id, response.refreshToken);
         } else {
            throw new jwt.JsonWebTokenError("Wrong token");
         }

         return response;
      } catch (error) {
         throw error;
      }
   }

   /**
    * Comparing refresh tokens from client and database.
    * @param clientToken Refresh token from client.
    * @param clientHashedToken Hashed refresh token from client.
    * @param dbTokenData Token credentials from database.
    * @returns True if tokens are same, false otherwise.
    */
   async compareRefreshTokens(clientToken: string, clientHashedToken: string, dbTokenData: StoredRefreshToken): Promise<boolean> {
      try {
         let tokenValid: boolean;

         const clientTokenPayload: IJwtPayload = await verifyToken(clientToken, { type: "refresh" });

         const isHashedTokensSame: boolean = clientHashedToken === dbTokenData.hashedToken;
         const isIdsSame: boolean = clientTokenPayload.id === dbTokenData.id;

         tokenValid = isHashedTokensSame && isIdsSame ? true : false;

         return tokenValid;
      } catch (error) {
         throw error;
      }
   }

   // Token general operations

   async generateTokens(userCredentials: ILimitedUserDetails | IJwtPayload): Promise<ILoginTokens> {
      const tokenPayload: IJwtPayload = { id: userCredentials.id.toString(), username: userCredentials.username, permissions: userCredentials.permissions };

      const accessToken: string = await this.generateToken(tokenPayload, { type: "access" });
      const refreshToken: string = await this.generateToken(tokenPayload, { type: "refresh" });

      const tokens: ILoginTokens = { accessToken, refreshToken };
      return tokens;
   }

   async generateToken(payload: IJwtPayload, type: TokenType, options?: SignOptions): Promise<string> {
      return generateToken(payload, type, options);
   }

   async hashToken(token: string): Promise<string> {
      if (typeof token === 'string') {
         return crypto.createHash('sha256').update(token).digest('hex');
      } else {
         console.error('Error: Token is not of type string. Token type: ' + typeof token);
         throw new HashingTokenError();
      }
   }

   // Database operations

   abstract setPassword(code: string, password: string, type: "registration" | "reset"): Promise<void>;
   abstract getUserCredentialsByEmail(email: string): Promise<ILimitedUserDetails>;
   abstract getUserJwtCredentialsById(id: string | Types.ObjectId): Promise<IJwtPayload>;
   abstract getRefreshTokenCredentialsFromDB(hashedToken: string): Promise<StoredRefreshToken>;
   abstract replaceRefreshTokenInDB(oldTokenId: string, newToken: string): Promise<void>;
   abstract saveRefreshTokenInDB(tokenCredentials: StoredRefreshTokenBase): Promise<void>;
   abstract generateLoginCode(): Promise<string>;
   abstract saveLoginCodeInDB(email: string, code: string): Promise<void>;
}