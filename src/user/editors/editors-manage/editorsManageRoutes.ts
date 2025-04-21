import { Router } from "express";
import EditorsManageController from "./editorsManageController.js";
import EditorRepository from "../editor/editorRepository.js";
import EditorsManageService from "./editorsManageService.js";
import EmailService from "../../../shared/services/emailService.js";
import restMiddleware from "../../../shared/middleware/restMiddleware.js";

const editorsManageRoutes: Router = Router();

const editorRepository = new EditorRepository();
const editorManageService = new EditorsManageService(editorRepository);
const emailService = new EmailService();
const editorsManageController = new EditorsManageController(editorManageService, emailService);

// Post
editorsManageRoutes.post('/create', restMiddleware, editorsManageController.createEditor.bind(editorsManageController));

// Get
editorsManageRoutes.get('/all', restMiddleware, editorsManageController.showAllUsernames.bind(editorsManageController));
editorsManageRoutes.get('/get-all-permissions', restMiddleware, editorsManageController.sendAllPermissions.bind(editorsManageController));

// Put
editorsManageRoutes.put('/resend-login-code', restMiddleware, editorsManageController.resendEmailWithLoginCode.bind(editorsManageController));
editorsManageRoutes.put('/change-permissions', restMiddleware, editorsManageController.changeEditorPermissions.bind(editorsManageController));
editorsManageRoutes.put('/change-username', restMiddleware, editorsManageController.changeEditorUsername.bind(editorsManageController));

export default editorsManageRoutes;