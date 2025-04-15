import { Request, Response, NextFunction } from "express";
import SuperAdminService from "../services/superAdminService.js";

class SuperAdminController {
   constructor(private superAdminService: SuperAdminService) { }

   disableRestApi(req: Request, res: Response, next: NextFunction): void {
      const restApiTypes = req.body;
      try {
         this.superAdminService.disableRestApi(restApiTypes);
         res.status(200);
      } catch (error) {
         next();
      }
   }

   activateRestApi(req: Request, res: Response, next: NextFunction): void {
      try {
         this.superAdminService.activateRestApi();
         res.status(200);
      } catch (error) {
         next();
      }
   }
}

export default SuperAdminController;