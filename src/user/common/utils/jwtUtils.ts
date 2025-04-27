import jwt, { SignOptions } from "jsonwebtoken";
import jwtConfig from "../../../shared/config/jwt.config.js";

export interface IJwtPayload {
   id: string;
   username: string;
   permissions?: number;
}

export type TokenType = {
   type: "access" | "refresh"
}

export const generateToken = async (payload: IJwtPayload, tokenType: TokenType, options: SignOptions = defaultTokenOptions(tokenType)): Promise<string> => {
   // @ts-expect-error getTokenValue gives (string | number) value
   let secret: string = getTokenValue("secret", tokenType);

   return jwt.sign(payload, secret, options);
}

export const verifyToken = async (token: string, tokenType: TokenType): Promise<IJwtPayload> => {
   // @ts-expect-error getTokenValue gives (string | number) value
   let secret: string = getTokenValue("secret", tokenType);

   return jwt.verify(token, secret) as IJwtPayload;
}

const defaultTokenOptions = (tokenType: TokenType): SignOptions => {
   // @ts-expect-error getTokenValue gives (string | number) value
   let expirationTime: number = getTokenValue("expirationTime", tokenType);

   const options: SignOptions = {
      expiresIn: expirationTime
   };
   return options;
}

const getTokenValue = (valueType: "secret" | "expirationTime", tokenType: TokenType): string | number => {
   let value: string | number;

   if (valueType === "secret") {
      switch (tokenType.type) {
         case "access":
            value = jwtConfig.accessSecret;
            break;
         case "refresh":
            value = jwtConfig.refreshSecret;
            break;
      }
   } else if (valueType === "expirationTime") {
      switch (tokenType.type) {
         case "access":
            value = convertMsToS(jwtConfig.accessTokenExpiry);
            break;
         case "refresh":
            value = convertMsToS(jwtConfig.refreshTokenExpiry);
            break;
      }
   } else {
      throw new Error("Wrong valueType value | jwtUtils");
   }

   return value;
}

const convertMsToS = (milliseconds: number) => milliseconds / 1000;