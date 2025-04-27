import { Request, Response, NextFunction } from "express";
import SuperAdminService from "./superAdminService.js";

class SuperAdminController {
   constructor(private superAdminService: SuperAdminService) { }

   disableRestApi(req: Request, res: Response, next: NextFunction): void {
      const restApiTypes = req.body;
      try {
         this.superAdminService.disableRestApi(restApiTypes);
         res.sendStatus(200);
      } catch (error) {
         next();
      }
   }

   activateRestApi(req: Request, res: Response, next: NextFunction): void {
      try {
         this.superAdminService.activateRestApi();
         res.sendStatus(200);
      } catch (error) {
         next();
      }
   }
}

export default SuperAdminController;