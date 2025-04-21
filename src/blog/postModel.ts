import { Document, model, Schema, Types } from "mongoose";
import { IEditor } from "../user/editors/editor/editorModel.js";

interface IPost extends Document {
   title: string;
   subtitle?: string;
   content: string;
   author: Types.ObjectId | IEditor;
   imageUri: string;
   tags: string[];
   readingTime?: Date;
   createdAt?: Date;
}

const postSchema: Schema = new Schema({
   title: { type: String, required: true },
   subtitle: { type: String },
   content: { type: String, required: true },
   author: { types: String, required: true },
   imageUri: { type: String, required: true },
   tags: { type: [String], required: true },
   readingTime: { type: Date },
   createdAt: { type: Date, default: Date.now }
});

const Post = model<IPost>("Post", postSchema);

export default Post;