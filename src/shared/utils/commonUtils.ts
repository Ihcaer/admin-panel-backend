import crypto from "crypto";

export const generateCode = (length: number = 10): string => crypto.randomBytes(length).toString('hex');