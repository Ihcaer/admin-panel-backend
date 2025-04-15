import { IError, RestOperations, State } from "./store.interface.js";

const initialState: State = {
   restEnabled: { get: true, post: true, put: true, delete: true },
   errors: []
};

let currentState: State = { ...initialState };

// State operations
export const getState = (): State => { return { ...currentState }; };

export const clearState = (array: keyof State): void => {
   switch (array) {
      case 'restEnabled':
         currentState.restEnabled = initialState.restEnabled;
         break;
      case 'errors':
         currentState.errors = initialState.errors;
         break;
   }
};

// Security operations
export const getRestState = (type: string): boolean => {
   switch (type) {
      case "get":
         return currentState.restEnabled.get;
      case "post":
         return currentState.restEnabled.post;
      case "put":
         return currentState.restEnabled.put;
      case "delete":
         return currentState.restEnabled.delete;
      default:
         return false;
   }
};

export const disableRestOperations = (type: "all" | "save" | "get"): void => {
   switch (type) {
      case "all":
         currentState.restEnabled.get = currentState.restEnabled.post = currentState.restEnabled.put = currentState.restEnabled.delete = false;
         break;
      case "save":
         currentState.restEnabled.post = currentState.restEnabled.put = currentState.restEnabled.delete = false;
         break;
      case "get":
         currentState.restEnabled.get = false;
         break;
      default:
         currentState.restEnabled.get = currentState.restEnabled.post = currentState.restEnabled.put = currentState.restEnabled.delete = false;
   }
};

// Error operations
export const addError = (errorMessage: string, errorTime: Date = new Date()): void => {
   const error: IError = { message: errorMessage, time: errorTime };
   currentState.errors.push(error);
};

export const isErrorRegistered = (errorMessage: string): boolean => {
   return getState().errors.some(error => error.message === errorMessage);
}