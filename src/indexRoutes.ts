import { Application } from "express";
import contactFormRoutes from "./contact-form/contactFormRoutes.js";
import editorsManageRoutes from "./user/editors/editors-manage/editorsManageRoutes.js";
import editorRoutes from "./user/editors/editor/editorRoutes.js";
import superAdminRoutes from "./user/editors/super-admin/superAdminRoutes.js";

const registerRoutes = (app: Application): void => {
   app.use('/contact-form', contactFormRoutes);
   app.use('/editors-management', editorsManageRoutes);
   app.use('/editor', editorRoutes);
   app.use('/super-admin', superAdminRoutes);
};

export default registerRoutes;