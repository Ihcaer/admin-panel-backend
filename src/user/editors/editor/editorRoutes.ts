import { Router } from "express";
import EditorRepository from "./editorRepository.js";
import EditorService from "./editorService.js";
import EditorRefreshTokenRepository from "../refresh-tokens/editorRefreshTokenRepository.js";
import EditorController from "./editorController.js";
import restMiddleware from "../../../shared/middleware/restMiddleware.js";
import EmailService from "../../../shared/services/emailService.js";
import adminPanelAuthMiddleware from "../middleware/adminPanelAuthMiddleware.js";

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
editorRoutes.put('/change-password', restMiddleware, adminPanelAuthMiddleware, editorController.changePassword.bind(editorController));

export default editorRoutes;