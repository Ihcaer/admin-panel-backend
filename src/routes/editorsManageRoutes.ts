import { Router } from "express";
import EditorsManagementController from "../controllers/userManagement/editorsManagementController.js";
import EditorRepository from "../repositories/editorRepository.js";
import EditorsManageService from "../services/editorsManageService.js";
import EmailService from "../services/emailService.js";
import restMiddleware from "../middlewares/restMiddleware.js";

const editorsManageRoutes: Router = Router();

const editorRepository = new EditorRepository();
const editorManageService = new EditorsManageService(editorRepository);
const emailService = new EmailService();
const editorsManagementController = new EditorsManagementController(editorManageService, emailService);

editorsManageRoutes.post('/create', restMiddleware, editorsManagementController.createEditor.bind(editorsManagementController));
editorsManageRoutes.put('/confirm', restMiddleware, editorsManagementController.confirmEditorAccount.bind(editorsManagementController));
editorsManageRoutes.get('/all', restMiddleware, editorsManagementController.showAllUsernames.bind(editorsManagementController));

export default editorsManageRoutes;