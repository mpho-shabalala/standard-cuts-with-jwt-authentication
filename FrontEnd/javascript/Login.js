import { AutoRoutingMixin } from "./Mixins.js";
import { Standardcuts } from "./standardCuts.js";

export class Login extends AutoRoutingMixin(Standardcuts){
    constructor(extended_url){
        super(extended_url);
        // this.#checkToken();
    }

    handleFormSubmit =   async ( loginForm,notificationParagraph,  loginURL )  => {
        loginForm.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get("username");
            const password = formData.get("password");
            try{
                //post login data to backend
                const response = await fetch(`${this.baseUrl}${loginURL}`,
                    {
                        method: 'POST',
                        headers: this.postResponseHeaders(),
                        body: JSON.stringify({
                            username,
                            password,
                        })
                    }
                );
                
                const data = await response.json();
                this.routeToPage(data, this.pageUrl);

            }catch(error){
                console.log('status', response.status)
                console.log("Error message: ", error.message);
                this.errorNotificationUI(notificationParagraph, 'Incorrect username or password')
            }
            })
        }
    }
