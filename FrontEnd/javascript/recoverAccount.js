import { AutoRoutingMixin } from "./Mixins.js";
import { Standardcuts } from "./standardCuts.js";

export class recoverAcc extends         AutoRoutingMixin(Standardcuts){
    constructor(extended_url){
        super(extended_url);
    }

    handleFormSubmit = async (recoveryForm, notificationParagraph, recoveryURL) => {
        recoveryForm.addEventListener('submit', async e => {
            e.preventDefault();
            //instantiate and extract email from form
            const formData = new FormData(recoveryForm);
            const email = formData.get('email');
            try{
                //post email to backend
                const response = await fetch(`${this.baseUrl}${recoveryURL}`,
                    {
                        method: 'POST',
                        headers: this.postResponseHeaders(),
                        body: JSON.stringify({
                            email
                        })
                    }
                );

                const data = await response.json();
                console.log(data);

            }catch(error){
                console.log("recovery error: ", error.message);
            }
        }
        )
    }
}