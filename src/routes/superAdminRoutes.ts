import { Router } from "express";
import SuperAdminService from "../services/superAdminService.js";
import SuperAdminController from "../controllers/superAdminController.js";
import adminPanelPermissionsMiddleware from "../middlewares/adminPanelPermissionsMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const superAdminRoutes: Router = Router();

const superAdminService: SuperAdminService = new SuperAdminService();
const superAdminController: SuperAdminController = new SuperAdminController(superAdminService);

superAdminRoutes.post('disable-rest', authMiddleware, await adminPanelPermissionsMiddleware('SUPER_ADMIN'), superAdminController.disableRestApi.bind(superAdminController));
superAdminRoutes.post('activate-rest', authMiddleware, await adminPanelPermissionsMiddleware('SUPER_ADMIN'), superAdminController.activateRestApi.bind(superAdminController));

export default superAdminRoutes;