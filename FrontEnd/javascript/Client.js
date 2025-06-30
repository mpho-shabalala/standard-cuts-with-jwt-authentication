import { Login } from "../javascript/Login.js";
import { Dashboard } from "../javascript/Dashboard.js";
import { Signup } from "../javascript/Signup.js";
import { Homepage } from "../javascript/Homepage.js";
import { recoverAcc } from "./recoverAccount.js";
import { UIComponents } from "../javascript/UIComponents.js";
import { verifyUser } from "./verifyuser.js";
// import { sign } from "crypto";

class client{
    _UI = new UIComponents();
    _menuBarOpen = false;




    constructor(){
        this.init();
    }
    get UI(){ return this._UI; }
    get isMenuBarOpen(){  return this._menuBarOpen; }



    init = async () => {
        if(document.body.id === 'homepage-body'){
            const body = this.UI.getDomElement('body', 'homepage-body', null);
            const menuIcon = this.UI.getDomElement('img', 'humburger-menu', null);
            this.#updateMenuBar(menuIcon, body);
            const homepage = new Homepage('/user/user_detail');
            await homepage.navigateUser();
        }else if(document.body.id === 'login-page'){
            const loginForm = this.UI.getDomElement('form', 'login');
             const notificationParagraph = this.UI.getDomElement('p', 'notification');
            if(loginForm){
                const login = new Login('/user/user_detail');
                 await login.navigateUser();
                login.handleFormSubmit(loginForm,notificationParagraph,'/authentication/login' );
            }
        }else if(document.body.id === 'dashboard'){
            //logout
            const logout = this.UI.getDomElement('a', 'logout-btn');
    
            //user details
            const usernameP = this.UI.getDomElement('p', null, 'username');
            const emailP = this.UI.getDomElement('p', null, 'email');
    
            //credit record
            const subFee = this.UI.getDomElement('td', 'subscription-fee');
            const subPeriod = this.UI.getDomElement('td', 'subscription-period');
            const cutCount = this.UI.getDomElement('td', 'cut-count');
            const dates = this.UI.getAllDomElements('date');
            const balance = this.UI.getDomElement('td', 'balance');
    
    
            //payment details
            const name = this.UI.getDomElement('td', 'name');
            const surname = this.UI.getDomElement('td', 'surname');
            const cardNumber = this.UI.getDomElement('td', 'card-number');
            const cvv = this.UI.getDomElement('td', 'cvv');
            const expiryDate = this.UI.getDomElement('td', 'exp-date');
            //dashboard instantiation
            const db = new Dashboard('/user/user_detail', '/user_credit/user_credit_details','/payment/payment_detail');
                await db.updateUserUI(usernameP, emailP);//update user ui
                await db.updateCreditRecordUI(subFee, subPeriod, cutCount, balance, dates); //update credit details 
                await db.updatePaymentDetailsUI(name, surname, cardNumber, cvv, expiryDate)
          
            db.logout(logout); //logout event 
        }else if(document.body.id === 'signup-page'){
            const signupForm = this.UI.getDomElement('form', 'signup');
            if(signupForm){
                const notificationParagraph = this.UI.getDomElement('p', 'notification');
                const signup = new Signup("/user/user_detail");
                 await signup.navigateUser();
                await signup.handleFormSubmit(signupForm, "/authentication/users", notificationParagraph);
            }
        }else if( document.body.id === 'recover-account'){
            const recoveryForm = this.UI.getDomElement('form', 'recover-form');
            if(recoveryForm){
                const notificationParagraph = this.UI.getDomElement('p', 'notification');
                const recover = new recoverAcc(null);// no need for extended url because no automatic authentication needed
                await recover.handleFormSubmit(recoveryForm, notificationParagraph, '/authentication/recover_account');
            }
        }else if(document.body.id === 'verify-user'){
            const verify = new verifyUser('/authentication/verify_user');
        }
    }

    #updateMenuBar = (menuIcon, body) => {
       
        const menu = this.#createMenu();
        menuIcon.addEventListener('click', e => {
            e.preventDefault();
            body.append(menu);
            const cancelMenu = this.UI.getDomElement('li','cancel');
            cancelMenu.addEventListener('click', e => {
                e.preventDefault();
                body.removeChild(menu);
            });
        });
    }

    #createMenu = () => {
        const MENUID = 'auth-menu';
        const MENUCLASS = 'menu';
        const LOGINLIID = 'login';
        const SIGNUPLIID = 'signup';
        const MENULICLASS = 'menu-link';
        const MENUCANCELICONID = 'cancel';
        const AUTHULID = 'auth-ul';
        const menu = this.UI.createDiv(MENUID, MENUCLASS);
        const cancelMenuIcon = this.UI.createLI(MENUCANCELICONID, null)
        cancelMenuIcon.textContent = 'X';
        const login = this.UI.createAnchor('login.html',LOGINLIID, MENULICLASS);
        login.textContent = 'LOGIN';
        const signup = this.UI.createAnchor('signup.html',SIGNUPLIID, MENULICLASS);
        signup.textContent = 'SIGNUP';
        const authUL = this.UI.createUL(AUTHULID, null);
        authUL.append(login, signup);
        menu.append(cancelMenuIcon,authUL);
        return menu;
    }
}

new client();