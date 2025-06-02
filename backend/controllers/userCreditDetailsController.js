const util = require('./utilities')
const relativeFilePath = '../Backend/database/userCreditDetails.json';

exports.getAllUserCreditDetails = async (req, res, next) => {
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

exports.getUserCreditDetails = async (req, res, next) => {
    const userID = req.user.userID;
    // const token = req.user.token;
    try{
        const creditData = util.readData(relativeFilePath);
        let userCreditData = {};
        if( userID != (undefined || null)){
            userCreditData = creditData.userCreditDetails.find(creditDetails => creditDetails.userID === userID);
            if(userCreditData == undefined){
                return res.status(500).json({
                    status: 'fail',
                    userCreditExist: false,
                    message: 'user did not input credit details'
                });
            }
            return res.status(200).json({
                status : 'success',
                subscriptionFee : userCreditData.subscriptionFee ,
                period: userCreditData.period,
                cutCountRemaining : userCreditData.cutCountRemaining,
                balance : userCreditData.balance,
                dates_allocated : userCreditData.dates_allocated
            });
        }
        throw new Error('User specified does not exist')
    }catch(error){
        return res.status(500).json({
            status : 'fail',
            message : error.message
        });
    }
}
