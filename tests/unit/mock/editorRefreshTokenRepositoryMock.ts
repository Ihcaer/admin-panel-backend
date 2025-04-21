import { Types } from "mongoose";

import EditorRefreshToken from "../../../src/user/editors/refresh-tokens/editorRefreshTokenModel.js";

import crypto from "crypto";
import { generateToken, IJwtPayload } from "../../../src/shared/utils/jwtUtils.js";
import { StoredRefreshToken, StoredRefreshTokenBase } from "../../../src/user/common/interfaces/storedRefreshTokenInterface.js";

export class EditorRefreshRepositoryMock {
   refreshTokens: StoredRefreshToken[] = [];
   idPrefix: string = "5f9f1b9b9c9c1b000000000";

   constructor() {
      this.generateTestRefreshTokenStore();
   }

   // Mock methods

   async generateTestRefreshTokenStore(): Promise<void> {
      for (let i = 0; i < 3; i++) {
         const token: string = await this.makeHashedTestToken(i);
         const now: Date = new Date();
         const expires: number = this.generateExpirationTime();

         const storedToken = new EditorRefreshToken({ _id: Types.ObjectId.createFromHexString(this.idPrefix + i), hashedToken: token, userId: i.toString(), expires });
         this.refreshTokens.push(storedToken);
      }
   };

   generateExpirationTime(): number {
      const now: Date = new Date();
      const expirationTime: number = (now.getTime() + Math.floor(Math.random() * 48) * 60 * 60 * 1000) / 1000;
      return expirationTime;
   }

   // Repository methods

   async makeHashedTestToken(i: number): Promise<string> {
      const payload: IJwtPayload = { id: i.toString(), username: "testUsername" + i };
      const token: string = await generateToken(payload, { type: "refresh" });
      const hashedToken: string = crypto.createHash('sha256').update(token).digest('hex')
      return hashedToken;
   }

   async saveToken(tokenCredentials: StoredRefreshTokenBase): Promise<void> {
      const expires: number = this.generateExpirationTime();

      const token = new EditorRefreshToken({ hashedToken: tokenCredentials.hashedToken, userId: tokenCredentials.userId, expires });
      this.refreshTokens.push(token);

      const savedToken: boolean = this.refreshTokens.some(token => String(token.hashedToken) === tokenCredentials.hashedToken);
      if (savedToken) {
         console.log("Token saved");
      } else {
         console.error("Token save error");
      }
   }

   async findToken(token: string): Promise<StoredRefreshToken | null> {
      const userIndex: number = 1;
      const now: Date = new Date();
      const expires: number = now.getTime() + 8 * 60 * 60 * 1000;
      const tokenData = new EditorRefreshToken({ hashedToken: "testToken", userId: Types.ObjectId.createFromHexString(this.idPrefix + userIndex), expires });
      return tokenData;
   }

   async replaceToken(oldTokenId: string, newToken: string): Promise<void> {
      let tokenToChange: StoredRefreshToken = this.refreshTokens.find((token) => token.id === oldTokenId);
      if (tokenToChange) {
         tokenToChange.hashedToken = newToken;
         console.log("Token replaced");
      } else {
         console.error("Token not found");
      }
   }
}