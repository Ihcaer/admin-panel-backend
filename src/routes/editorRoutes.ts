import { Router } from "express";
import EditorRepository from "../repositories/editorRepository.js";
import EditorService from "../services/user/editorService.js";
import EditorRefreshTokenRepository from "../repositories/editorRefreshTokenRepository.js";
import EditorController from "../controllers/user/editorController.js";
import restMiddleware from "../middlewares/restMiddleware.js";
import EmailService from "../services/emailService.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const editorRoutes: Router = Router();

const editorRepository: EditorRepository = new EditorRepository();
const editorRefreshTokenRepository: EditorRefreshTokenRepository = new EditorRefreshTokenRepository();
const editorService: EditorService = new EditorService(editorRepository, editorRefreshTokenRepository);
const emailService: EmailService = new EmailService();
const editorController: EditorController = new EditorController(editorService, emailService);

editorRoutes.post('/login', restMiddleware, editorController.login.bind(editorController));
editorRoutes.put('/remind-password', restMiddleware, editorController.remindPassword.bind(editorController));
editorRoutes.put('/confirm-account', restMiddleware, editorController.confirmEditorAccount.bind(editorController));
editorRoutes.put('/confirm-password-reminder', restMiddleware, editorController.confirmPasswordChangeFromReminder.bind(editorController));
editorRoutes.put('/change-password', restMiddleware, authMiddleware, editorController.changePassword.bind(editorController));

export default editorRoutes;