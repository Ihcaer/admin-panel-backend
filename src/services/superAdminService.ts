import { clearState, disableRestOperations } from "../store/store.js";

class SuperAdminService {
   disableRestApi(type: "all" | "save" | "get"): void {
      disableRestOperations(type);
   }

   activateRestApi(): void {
      clearState("restEnabled");
   }
}

export default SuperAdminService;