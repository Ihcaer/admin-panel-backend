import { NonCriticalError } from "./indexErrors.js";

export class UserNotFoundInDatabaseError extends NonCriticalError {
   readonly type: "user" | "editor";

   constructor(userType: "user" | "editor") {
      super();
      this.name = this.constructor.name;
      this.message = userType.charAt(0).toUpperCase() + userType.slice(1) + " not found";
      this.type = userType;
      this.statusCode = 404;
   }
}

export class LoginCredentialsIncorrectError extends NonCriticalError {
   constructor() {
      super();
      this.name = this.constructor.name;
      this.message = "Login credentials invalid";
      this.statusCode = 401;
   }
}

export class MissingLoginCredentialsError extends NonCriticalError {
   constructor() {
      super();
      this.name = this.constructor.name;
      this.message = "E-mail and password are required";
      this.statusCode = 404;
   }
}

export class AuthenticationError extends NonCriticalError {
   constructor() {
      super();
      this.name = this.constructor.name;
      this.message = "Authentication failed";
      this.statusCode = 401;
   }
}

export class PermissionsAuthenticationError extends NonCriticalError {
   constructor() {
      super();
      this.name = this.constructor.name;
      this.message = "No permission";
      this.statusCode = 403;
   }
}

export class NoUserDataError extends NonCriticalError {
   constructor() {
      super();
      this.name = this.constructor.name;
      this.message = "Incomplete user data";
      this.statusCode = 400;
   }
}