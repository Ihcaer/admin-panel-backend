interface IJwtConfig {
   accessSecret: string;
   refreshSecret: string;
   accessTokenExpiry: number;
   refreshTokenExpiry: number;
}

const jwtConfig: IJwtConfig = {
   accessSecret: String(process.env.ACCESS_SECRET),
   refreshSecret: String(process.env.REFRESH_TOKEN_SECRET),
   accessTokenExpiry: Number(process.env.ACCESS_TOKEN_EXPIRY_HOURS) * 60 * 60 * 1000,
   refreshTokenExpiry: Number(process.env.REFRESH_TOKEN_EXPIRY_HOURS) * 60 * 60 * 1000
}

export default jwtConfig;