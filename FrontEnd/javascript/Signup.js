import { AutoRoutingMixin } from "./Mixins.js";
import { Standardcuts } from "./standardCuts.js";

export class Signup extends AutoRoutingMixin(Standardcuts){
    constructor(extended_url){
        super(extended_url);
        this.submitToken();
    }

    handleFormSubmit =   async ( signupForm, signupURL, notificationParagraph)  => {
        signupForm.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = this.#getFormInputs(signupForm);
            
            if(this.#isPasswordTestPassed(formData.password, formData.confirmPassword, notificationParagraph)){
                try{
                    const response = await fetch(`${this.baseUrl}${signupURL}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type':'application/json'},
                            body: JSON.stringify(formData)
                        }
                    );
                    
                    const data = await response.json();
                    console.log('data: ',data)
                    // this.routeToPage(data, this.pageUrl);

                }catch(error){
                    console.log("Error messages: ", error.message);
                }
            }
    })
    }

    #getFormInputs = (form) => {
        const formData = new FormData(form);
        const email = formData.get("email");
        const confirmPassword = formData.get("confirmPassword");
        const password = formData.get("password");
        const username = formData.get("username");
        const acceptNewsletter = formData.get("acceptNewsletter");
        return {
            email, password, confirmPassword, username, acceptNewsletter
        }
    }

    #isPasswordTestPassed = (password, confirmPassword, notificationParagraph) => {

        if(!this.#isPasswordMatching(password, confirmPassword)) {
           this.errorNotificationUI(notificationParagraph, "Passwords do not match!!");
            return false;
        }   
        if(!this.#isPasswordValid(password)){
            this.errorNotificationUI(notificationParagraph, "Invalid password format!!");
           return false;
        }
        return true;
    }

 

    #isPasswordValid = password => {
        const regex = new RegExp("^(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$");
        if(regex.test(password)) return true;
        return false;
    }

    #isPasswordMatching = (password, confirmPassword) => {
        return (password === confirmPassword);
    }


}