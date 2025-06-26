import { AutoRoutingMixin } from "./Mixins.js";
import { Standardcuts } from "./standardCuts.js";

/**
 * @Author MG SHABALALA
 * @Date 6 june 2025
 * @class Homepage
 * @description this class is responsible for redirecting the user upon email verification
 * to access, also update the responsive user interface menu bar
 */
export class verifyUser extends AutoRoutingMixin(Standardcuts){
    /**
     * @description extends the parent functionality
     * @param {string} extendedUrl for authenticating the user, by sending login user information into the backend
     */
    constructor(extendedUrl){
        super(extendedUrl);
        this.#updateUserVerification();
    }

    #updateUserVerification = async () => {
        window.addEventListener('DOMContentLoaded', async () => {
            try{
            const data = await this.submitURLToken();
            if(data.status === 'success'){
                console.log('user verified')
                setTimeout(() => {
                    this.routeToPage(data, this.pageUrl);
                }, 4000);
            }else {
                throw new Error(data.message);
            }
            }catch(error){
                console.log(error.message);
            }
        })
        
        
    }
}