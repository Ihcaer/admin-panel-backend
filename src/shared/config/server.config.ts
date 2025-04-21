interface ServerConfig {
   production: boolean;
   port: number;
}

const serverConfig: ServerConfig = {
   production: process.env.PRODUCTION === "true",
   port: Number(process.env.PORT) || 3000,
}

export default serverConfig;