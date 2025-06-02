import { Standardcuts } from "./standardCuts.js";
/**
 * @author M.G SHABALALA
 * @description decouples page routing functionality from the parrent class
 */
export const AutoRoutingMixin = () => class extends Standardcuts {

    /**
     * @description route to plage based on url and validity of the data  
     * @param {JSON} data provided by the server based on the request
     * @param {string} url of the page to route to
     */
    routeToPage = (data, url) => {
        //check data status
        if(data?.status === 'fail'){
            throw new Error('Invalid credentials'); // throws error when status is fail
        }
       
        const username = data?.user?.username ?? data?.data?.user?.username ?? '';
        const email = data?.user?.email ?? data?.data?.user?.email ?? '';
        const userID = data?.user?.userID ?? data?.data?.user?.userID ?? '';
        localStorage.setItem('username', username);

        localStorage.setItem('token', data.token );  //set token as the new value to the cookie
        // localStorage.setItem('username', ( (data.user.username != undefined) ? data.user.username : data.data.user.username));  //set username as the new value to the cookie
        localStorage.setItem('email', email);  //set email as the new value to the cookie
        localStorage.setItem('userId',userID);  //set userID as the new value to the cookie
        console.log('url: ',url)
        window.location.href = url;
        
    }

    
}
