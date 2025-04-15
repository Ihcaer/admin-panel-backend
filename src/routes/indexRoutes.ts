import { Application } from "express";
import contactFormRoutes from "./contactFormRoutes.js";
import editorsManageRoutes from "./editorsManageRoutes.js";
import editorRoutes from "./editorRoutes.js";
import superAdminRoutes from "./superAdminRoutes.js";

const registerRoutes = (app: Application): void => {
   app.use('/contact-form', contactFormRoutes);
   app.use('/editors-management', editorsManageRoutes);
   app.use('/editor', editorRoutes);
   app.use('/super-admin', superAdminRoutes);
};

export default registerRoutes;