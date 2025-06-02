const { parse } = require('path');
const util = require('./utilities')
const creditFileData = '../Backend/database/userCreditDetails.json';
const paymentFileData = '../Backend/database/paymentDetails.json';
const userFileData = '../Backend/database/users.json';

exports.getUserDetails = async (req, res, next) => {
    
    try{
        const userID = req.user.userID;
        const token = req.user.token;
        console.log(userID, token);
        const users = util.readData(userFileData)
        const user = users.users.find(user => user.userID === userID);
        const results = {
            user
        };
        console.log('results', results)
        res.status(200).json({
            status: 'success',
            data: results
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            status: 'fail',
            data: null,
            message: error.message
        });
    }
}