import { model, Schema, Types } from "mongoose";
import { StoredRefreshToken } from "../../common/interfaces/storedRefreshTokenInterface.js";
import jwtConfig from "../../../shared/config/jwt.config.js";

const defaultExpirationDate = (): number => {
   const now: Date = new Date();
   return now.getTime() + jwtConfig.refreshTokenExpiry;
}

const editorRefreshTokenSchema: Schema = new Schema({
   hashedToken: { type: String, required: true },
   userId: { type: Types.ObjectId, required: true, ref: "Editor", index: true },
   expires: { type: Date, required: true, default: defaultExpirationDate() },
});

const EditorRefreshToken = model<StoredRefreshToken>("EditorRefreshToken", editorRefreshTokenSchema);

export default EditorRefreshToken;