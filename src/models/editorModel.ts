import { Document, model, Schema } from "mongoose";

export interface IEditorBase {
   username: string;
   email: string;
   permissions: number;
   loginCode?: string;
}

export interface IEditor extends IEditorBase, Document {
   password?: string;
   passwordResetCode?: string;
   createdAt?: Date;
}

const editorSchema: Schema = new Schema({
   username: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String },
   permissions: { type: Number, required: true },
   loginCode: { type: String, expires: '2d' },
   passwordResetCode: { type: String, expires: '10m' },
   createdAt: { type: Date, required: true, default: Date.now }
});

const Editor = model<IEditor>("Editor", editorSchema);

export default Editor;