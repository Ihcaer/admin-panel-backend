import { Router } from "express";
import SuperAdminService from "./superAdminService.js";
import SuperAdminController from "./superAdminController.js";
import adminPanelPermissionsMiddleware from "../middleware/adminPanelPermissionsMiddleware.js";
import adminPanelAuthMiddleware from "../middleware/adminPanelAuthMiddleware.js";

const superAdminRoutes: Router = Router();

const superAdminService: SuperAdminService = new SuperAdminService();
const superAdminController: SuperAdminController = new SuperAdminController(superAdminService);

superAdminRoutes.post('disable-rest', adminPanelAuthMiddleware, await adminPanelPermissionsMiddleware('SUPER_ADMIN'), superAdminController.disableRestApi.bind(superAdminController));
superAdminRoutes.post('activate-rest', adminPanelAuthMiddleware, await adminPanelPermissionsMiddleware('SUPER_ADMIN'), superAdminController.activateRestApi.bind(superAdminController));

export default superAdminRoutes;