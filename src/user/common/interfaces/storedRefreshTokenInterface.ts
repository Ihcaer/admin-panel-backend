import { Document, Types } from "mongoose";

export interface StoredRefreshTokenBase {
   hashedToken: string;
   userId: string | Types.ObjectId;
}

export interface StoredRefreshToken extends StoredRefreshTokenBase, Document {
   expires?: Date;
}