import { Response, NextFunction } from "express";
import { JwtNoTokenError } from "../errors/jwtCustomErrors.js";
import { IJwtPayload, verifyToken } from "../utils/jwtUtils.js";
import { ILoginTokens } from "../types/userTypes.js";
import EditorRepository from "../repositories/editorRepository.js";
import EditorRefreshTokenRepository from "../repositories/editorRefreshTokenRepository.js";
import EditorService from "../services/user/editorService.js";
import { AuthenticatedRequest } from "../interfaces/middlewareInterfaces.js";
import { AuthenticationError } from "../errors/userErrors.js";
import { CustomError, NonCriticalError } from "../errors/indexErrors.js";
import { TokenExpiredError } from "jsonwebtoken";

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
   const editorRepository: EditorRepository = new EditorRepository();
   const editorRefreshTokenRepository: EditorRefreshTokenRepository = new EditorRefreshTokenRepository();
   const editorService: EditorService = new EditorService(editorRepository, editorRefreshTokenRepository);

   const accessToken: string | undefined = req.headers.authorization?.split(' ')[1];
   const refreshToken: string | undefined = req.headers['x-refresh-token'] as string;

   try {
      if (!refreshToken) throw new JwtNoTokenError();

      const decodedToken: IJwtPayload = await proceedTokens(accessToken, refreshToken, editorService, res);

      req.userId = decodedToken.id;
      req.username = decodedToken.username;
      req.userPermits = decodedToken.permissions;

      next();
   } catch (error) {
      if (error instanceof CustomError) {
         res.status(error.statusCode).json({ message: error.message });
      } else {
         res.status(401).json({ message: "Access denied" });
      }
   }
}

const proceedTokens = async (accessToken: string | undefined, refreshToken: string, service: EditorService, res: Response): Promise<IJwtPayload> => {
   let decodedToken: IJwtPayload;
   const noAccessTokenErrorMessage: string = "No access token";

   try {
      if (accessToken) {
         decodedToken = await verifyToken(accessToken, { type: 'access' });
      } else {
         throw new NonCriticalError(noAccessTokenErrorMessage);
      }

      return decodedToken;
   } catch (error) {
      if (error instanceof TokenExpiredError || (error instanceof NonCriticalError && error.message === noAccessTokenErrorMessage)) {
         try {
            decodedToken = await verifyToken(refreshToken, { type: 'refresh' });
            const tokens: ILoginTokens = await service.validateRefreshToken(refreshToken);

            res.setHeader('Authorization', `Bearer ${tokens.accessToken}`);
            res.setHeader('X-Refresh-Token', tokens.refreshToken);

            const permissionsValid: boolean = await service.checkEditorPermissions(decodedToken.id, decodedToken.permissions!);
            if (!permissionsValid) throw new AuthenticationError();

            return decodedToken;
         } catch (error) {
            throw error;
         }
      } else {
         throw error;
      }
   }
}

export default authMiddleware;