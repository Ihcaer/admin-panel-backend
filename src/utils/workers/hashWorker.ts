import bcrypt from 'bcrypt';
import { parentPort, workerData } from 'node:worker_threads';

const hashPassword = async (password: string, saltRounds: number = 12): Promise<string> => {
   const hashedPassword: string = await bcrypt.hash(password, saltRounds);
   return hashedPassword;
}

hashPassword(workerData.password, workerData.saltRounds)
   .then((hashedPassword) => {
      parentPort?.postMessage(hashedPassword);
   }).catch((error) => {
      parentPort?.postMessage({ error: error.message });
   });