import { Router } from "express";
import EditorRepository from "../repositories/editorRepository.js";
import EditorService from "../services/user/editorService.js";
import EditorRefreshTokenRepository from "../repositories/editorRefreshTokenRepository.js";
import EditorController from "../controllers/user/editorController.js";
import restMiddleware from "../middlewares/restMiddleware.js";

const editorRoutes: Router = Router();

const editorRepository = new EditorRepository();
const editorRefreshTokenRepository = new EditorRefreshTokenRepository();
const editorService = new EditorService(editorRepository, editorRefreshTokenRepository);
const editorController = new EditorController(editorService);

editorRoutes.post('/login', restMiddleware, editorController.login.bind(editorController));
editorRoutes.post('/refresh-token', restMiddleware, editorController.refreshToken.bind(editorController));
editorRoutes.post('/remind-password', restMiddleware, editorController.remindPassword.bind(editorController));

export default editorRoutes;