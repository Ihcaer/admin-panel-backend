import { Types } from "mongoose";

/**
 * Type representing user login credentials.
 */
export type ILoginCredentials = {
   email: string;
   password?: string;
}

/**
 * Type representing user details for login validation and creating jwt tokens.
 */
export type ILimitedUserDetails = {
   id: Types.ObjectId | string;
   username: string;
   permissions?: number
   password?: string;
}

export type EditorUsernameAndPermits = {
   username: string;
   permissions: number;
}

/**
 * Type representing jwt tokens for login.
 */
export type ILoginTokens = {
   accessToken: string;
   refreshToken: string;
}