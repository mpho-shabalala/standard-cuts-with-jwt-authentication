

export class Standardcuts{
     // Private attributes
     #_base_url = 'http://localhost:5000/api/v1';
     #_page_url = '/FrontEnd/html/dashboard.html';
     #_extended_url = undefined;
     #_isLoading = false;
     
     /**
      * create an instance of a parent class with extended url of the resource needed
      * @param {string} extended_url 
      */
     constructor(extended_url){
        this.extendedUrl = extended_url;
     }
 
     //accessors
     /**
      * @return base url
      */
     get baseUrl(){ return this.#_base_url; }

     /**
      * @return the extended url, undefined by default
      */
     get extendedUrl(){ return this.#_extended_url; }
     
     /**
      * @return an instance of a class used for dom operations
      */
    //  get UI(){ return this.#_UI; }
    
     /**
      * @return state whether the resource is loading or not
      */
     get isLoading(){return this.#_isLoading; }

     /**
      * @return the url of the current page that has been displayed on the browser
      */
     get pageUrl(){ return this.#_page_url}


     //Mutators

     /**
      * set and edit the value of extended url
      */
     set extendedUrl(extended_url){ 
        this.#_extended_url = extended_url; 
     }

     /**
      * set and edit the loading state of a resource
      */
     set isLoading(is_loading){ this.#_isLoading = is_loading; }


     /**
      * @description this function is a security checking point which checks if
      * a user is authenticated by sending the user id from the cookies into the backend
      * for accessing resources, if the user is authenticated  it route the user to their
      * else it throws an error
      */
     submitToken = async () => {
    try {
        this.isLoading = true;
        const token = this.#retrieveToken();
        if (!token) throw new Error('No token found in localStorage');
        // if(token === undefined) return
        const response = await fetch(`${this.baseUrl}${this.extendedUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response)
        if (response.ok) {
            const token = this.#retrieveToken();
            // const userData = await response.json();
            const data = await response.json();
            data.token = token;
            return data; // reataches token into the data
        } else {
            throw new Error('Failed to validate user with token');
        }
    } catch (error) {
        console.log("Error message: ", error.message);
    } finally {
        this.isLoading = false;
    }
}

 navigateUser = async () => {
    
        const data = await this.submitToken(); // temporary
        console.log('data before navigation:', data)
        try{
            this.routeToPage(data,this.pageUrl);
        }catch(error){
            console.log('Error message', error.message)
        }
    }



    /**
     * @description gets user id from the session storage of the browser
     * @returns user id
     */
    #retrieveToken = () => {
        return localStorage.getItem('token');
    }
 
      /**
       * @description provide a central place to set and edit fetch state headers
       * @returns fetch api headers
       */
      postResponseHeaders = () => {
        return { 'Content-Type':'application/json'}
      }
}




