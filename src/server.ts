import express, { Application } from 'express';
import serverConfig from './config/server.config.js';
import errorHandler from './middlewares/errorHandlerMiddleware.js';
import compression from 'compression';
import registerRoutes from './routes/indexRoutes.js';
import connectDB from './config/db.config.js';

const server: Application = express();
const port: number = serverConfig.port;

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(compression());

registerRoutes(server);

server.use(errorHandler);

const startServer = async () => {
   try {
      await connectDB();
      server.listen(port, () => {
         console.log(`Server running at: http://localhost:${port}`);
      });
   } catch (error) {
      console.error("Server error:", error);
   }
}

startServer();