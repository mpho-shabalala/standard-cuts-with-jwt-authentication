
// import { locals } from "../../backend/app.js";
import { Standardcuts } from "./standardCuts.js";

export class Dashboard extends Standardcuts{
    _userID = '';
    _creditDetailsExtendedURL = '';
    _paymentDetailsExtendedURL = '';

    constructor(extended_url, credit_details_extended_url, payment_details_extended_url){
        super(extended_url);
        this.creditDetailsExtendedURL = credit_details_extended_url
        this.paymentDetailsExtendedURL = payment_details_extended_url
        // this.submitToken();
        this.#getUserPaymentDetails();
        this.#passedDateCheck('12/4/2025');
    }

    get userID(){
        return this._userID;
    }

   get creditDetailsExtendedURL(){
    return this._creditDetailsExtendedURL;
   }

   get currUser(){
    return this._currentUser;
   }

   set currUser(currUser){
    this._currentUser = currUser;
   }

   get paymentDetailsExtendedURL(){
    return this._paymentDetailsExtendedURL;
   }

   set creditDetailsExtendedURL(url){
    this._creditDetailsExtendedURL = url;
   }

   set paymentDetailsExtendedURL(url){
    this._paymentDetailsExtendedURL = url;
   }



   logout = logoutBtn => {
        logoutBtn.addEventListener('click', e => {
            localStorage.clear();
            window.location.href = '/FrontEnd/html/index.html';
        })
   }

   updateUserUI = async (username, email) => {
    const currUser = {
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email')
    }

    username.textContent = `${currUser ? currUser.username : 'unknown user'}`;
    email.textContent = `${currUser ? currUser.email : 'unknown user'}`;
   }

   updatePaymentDetailsUI = async (name, surname, cardNumber, cvv, expDate) => {
       const userPaymentDetails = await this.#getUserPaymentDetails();
       if(userPaymentDetails.status !== 'fail'){
        name.textContent = ` : ${userPaymentDetails.name}`;
        surname.textContent = ` : ${userPaymentDetails.surname}`;
        cardNumber.textContent = ` : ${userPaymentDetails.cardNumber}`;
        cvv.textContent = ` : ${userPaymentDetails.cvv}`;
        expDate.textContent = ` : ${userPaymentDetails.expiryDate}`;
        
       }
   }

   updateCreditRecordUI = async (subFee, subPeriod, cutCount, balance, dates) => {
    const userCreditDetails = await this.#getUserCreditDetails();
    console.log(userCreditDetails)
    if(userCreditDetails.status !== 'fail'){
        
        subFee.textContent = `: R${(userCreditDetails.status !== 'fail') ? userCreditDetails.subscriptionFee : '00'}.00`;
        subPeriod.textContent = `: ${(userCreditDetails !== 'fail') ? userCreditDetails.period : '0 Months'}`;
        cutCount.textContent = `: ${(userCreditDetails !== 'fail') ? userCreditDetails.cutCountRemaining : '0'}`;
        balance.textContent = `: R${(userCreditDetails !== 'fail') ? userCreditDetails.balance : '00'}.00`;
            dates.forEach((date, index) => {
                    const datePassed = this.#passedDateCheck(userCreditDetails.dates_allocated[index]);
                    if(datePassed == 'passed'){
                        date.setAttribute('class', 'passed')
                    }else if(datePassed == 'due-date'){
                        date.setAttribute('class', 'due');
                    }

                    date.textContent = `${index == 0 ? ' ' : ','}${(userCreditDetails.staus !== 'fail') ? userCreditDetails.dates_allocated[index] : '0/0/0'}`;

            });
    }
   }

   #passedDateCheck = date => {
        const currentDate = this.#getCurrentDate();
        const tokenizedDate = this.#tokenizeDate(date);
        if(currentDate.year > tokenizedDate.year){
            return 'passed';
        }
            
        if(currentDate.month > tokenizedDate.month){
            return 'passed';
        }
            
             
        if((currentDate.month == tokenizedDate.month) && (currentDate.day > tokenizedDate.day)) {
            
            return "passed";
        }

        if(currentDate.month == tokenizedDate.month &&
            currentDate.year == tokenizedDate.year &&
            currentDate.day == tokenizedDate.day
        ){
            return 'due-date'
        }
        return 'not-passed';
        
        
   }

   #tokenizeDate = (date) => {
    const dateToken = date.split('/');
    return {day : dateToken[0], month : dateToken[1], year : dateToken[2]}
   }

   #getCurrentDate = () => {
    const currentDate = new Date();
    return {
        day: (currentDate.getDate() < 10) ? `0${currentDate.getDate()}` :currentDate.getDate() , 
        month : (currentDate.getDate() < 10) ? `0${currentDate.getMonth() + 1}` :currentDate.getMonth() + 1, 
        year : currentDate.getFullYear()};
   }

   #getUserPaymentDetails = async () => {
    try{
        const token =  this.#retrieveToken();
                const response = await fetch(`${this.baseUrl}${this.paymentDetailsExtendedURL}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                // console.log('data', data)
                return data;
    }catch(error){
        console.log('error',error.mesage);
    }
   }

    #getUserCreditDetails = async () => {
        try{
            // const user = await this.#verifyCredentials();
            // if(user.status === 'success'){
             const token =  this.#retrieveToken();
                const response = await fetch(`${this.baseUrl}${this.creditDetailsExtendedURL}`,
                {
                   method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log(data)
                return data;
            // }
        }catch(error){
            console.log('error',error);
        }
    }


    #verifyCredentials = async () => {
        try{
            const response = await fetch(`${this.baseUrl}${this.extendedUrl}`,
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            });
            const data = await response.json();
            
            return data;
        }catch(error){
            console.log("Error message: ", error.message);
        }
    }

    #retrieveToken = () => {
        return localStorage.getItem('token');
    }
}