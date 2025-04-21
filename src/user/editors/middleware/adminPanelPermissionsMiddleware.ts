import { Response, NextFunction, RequestHandler } from "express"
import { AuthenticatedRequest } from "../../common/interfaces/middlewareInterfaces.js"
import { PermissionsAuthenticationError } from "../../common/errors/userErrors.js"
import EditorRepository from "../editor/editorRepository.js"
import EditorRefreshTokenRepository from "../refresh-tokens/editorRefreshTokenRepository.js"
import EditorService from "../editor/editorService.js"
import { CustomError } from "../../../shared/error/indexErrors.js"

export enum AdminPanelPermissions {
   SUPER_ADMIN = 0 << 0,
   EDITORS_MANAGE = 1 << 0,
   // Max permission is 1 << 30
}

const adminPanelPermissionsMiddleware = async (requiredPermit: keyof typeof AdminPanelPermissions): Promise<RequestHandler> => {
   return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
         if (!req.userPermits || !req.userId) throw new PermissionsAuthenticationError();

         if (requiredPermit === 'SUPER_ADMIN' || req.userPermits === AdminPanelPermissions.SUPER_ADMIN) {
            const isSuperAdmin: boolean = await isEditorPermissionsCorrect(req.userId, req.userPermits);
            if (!isSuperAdmin) throw new PermissionsAuthenticationError();
         } else if ((req.userPermits & AdminPanelPermissions[requiredPermit]) !== AdminPanelPermissions[requiredPermit]) {
            throw new PermissionsAuthenticationError();
         }

         next();
      } catch (error) {
         if (error instanceof CustomError) {
            res.status(error.statusCode).json({ message: error.message });
         } else {
            res.status(403).json({ message: "No permissions" });
         }
      }
   }
}

const isEditorPermissionsCorrect = async (id: string, permissions: number): Promise<boolean> => {
   const editorRepository: EditorRepository = new EditorRepository();
   const editorRefreshTokenRepository: EditorRefreshTokenRepository = new EditorRefreshTokenRepository();
   const editorService: EditorService = new EditorService(editorRepository, editorRefreshTokenRepository);

   return await editorService.checkEditorPermissions(id, permissions);
}

export default adminPanelPermissionsMiddleware;