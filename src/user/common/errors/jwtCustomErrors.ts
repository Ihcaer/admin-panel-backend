import { CriticalError, NonCriticalError } from "../../../shared/error/indexErrors.js";

export class JwtRefreshTokenNotFoundError extends NonCriticalError {
   constructor() {
      super();
      this.name = this.constructor.name;
      this.message = "Refresh token not found";
      this.statusCode = 404;
   }
}

export class JwtNoTokenError extends NonCriticalError {
   constructor() {
      super();
      this.name = this.constructor.name;
      this.message = "No jwt token";
      this.statusCode = 401;
   }
}

export class HashingTokenError extends CriticalError {
   constructor() {
      super();
      this.name = this.constructor.name;
      this.message = "Server error during token hashing";
      this.statusCode = 404;
   }
}