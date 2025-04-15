export type IError = {
   message: string;
   time: Date;
}

export type RestOperations = {
   get: boolean;
   post: boolean;
   put: boolean;
   delete: boolean;
};

export type State = {
   restEnabled: RestOperations;
   errors: IError[];
}