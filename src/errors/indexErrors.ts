export class CustomError extends Error {
   statusCode: number = 500;
   constructor() {
      super();
   }
}

export class NonCriticalError extends CustomError {
   constructor(message?: string) {
      super();
      if (message) this.message = message;
   }
}

export class CriticalError extends CustomError {
   constructor() {
      super();
   }
}

