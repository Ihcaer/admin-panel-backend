import bcrypt from 'bcrypt';
import path, { dirname } from 'node:path';
import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const hashInWorker = async (data: string, saltRounds: number = 12): Promise<string> => {
   return new Promise((resolve, reject) => {
      // Works only built
      const worker = new Worker(path.resolve(__dirname, "./workers/hashWorker.js"), {
         workerData: { data, saltRounds },
      });

      worker.on('message', (result: string | { error: string }) => {
         if (typeof result === 'object' && result.error) {
            reject(new Error(result.error));
         } else {
            resolve(result as string);
         }
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
         if (code !== 0) {
            reject(new Error("Worker stopped with exit code " + code));
         }
      });
   });
}

export const verifyHashedData = async (data: string, hashedData: string): Promise<boolean> => {
   return bcrypt.compare(data, hashedData);
}