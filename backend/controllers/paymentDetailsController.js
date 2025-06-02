const util = require('./utilities');
const relativeFilePath = '../Backend/database/paymentDetails.json';

exports.getAllUserPaymentDetails = async (req, res, next) => {
    try{
        const results = util.readData(relativeFilePath);
        res.status(200).json({
            status: 'success',
            data: results
        });
    }catch(error){
        res.status(500).json({
            status: 'fail',
            data: null,
            message: error.message
        })
    }
}

exports.getPaymentDetails = async (req, res) => {
    const userID = req.user.userID;
    try{
        const userPaymentDetails = util.readData(relativeFilePath);
        let userPaymentData = {};
        userPaymentData = userPaymentDetails.paymentDetails.find(paymentDetails => paymentDetails.userID === userID)
        console.log(userPaymentData);
        if(userPaymentData == undefined){
            return res.status(500).json({
                status : 'fail',
                userPaymentExist: false,
                message: 'user did not input payment details'
            });
        }

        return res.status(200).json({
            status : 'success',
            name: userPaymentData.name, 
            surname : userPaymentData.surname,
            cardNumber : userPaymentData.cardNumber,
            cvv : userPaymentData.cvv,
            expiryDate: userPaymentData.expiryDate
        })
        
    }catch(error){

    }
}

