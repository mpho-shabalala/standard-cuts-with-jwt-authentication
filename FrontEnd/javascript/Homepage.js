import { AutoRoutingMixin } from "./Mixins.js";
import { Standardcuts } from "./standardCuts.js";

/**
 * @Author MG SHABALALA
 * @Date 
 * @class Homepage
 * @description this class is used to load resources essential for an unauthenticated user 
 * to access, also update the responsive user interface menu bar
 */
export class Homepage extends AutoRoutingMixin(Standardcuts){
    /**
     * @description extends the parent functionality
     * @param {string} extendedUrl for authenticating the user, by sending login user information into the backend
     */
    constructor(extendedUrl){
        super(extendedUrl);
        
    }
}
