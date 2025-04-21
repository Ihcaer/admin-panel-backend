import { StoredRefreshToken, StoredRefreshTokenBase } from "../../common/interfaces/storedRefreshTokenInterface.js";
import EditorRefreshToken from "./editorRefreshTokenModel.js";


class EditorRefreshTokenRepository {
   async saveToken(tokenCredentials: StoredRefreshTokenBase): Promise<void> {
      await EditorRefreshToken.create(tokenCredentials);
   }

   async findToken(token: string): Promise<StoredRefreshToken | null> {
      return EditorRefreshToken.findOne({ token });
   }

   async replaceToken(oldTokenId: string, newToken: string): Promise<void> {
      await EditorRefreshToken.updateOne({ _id: oldTokenId }, { hashedToken: newToken });
   };
}

export default EditorRefreshTokenRepository;