const database = {
    users:[ {
        userID : 0, 
        username : "ben12",
        email : "ben12@gmail.com",
        contacts : "+2759355919",
        password : "Ben12SH."
    },
    {
        userID : 1, 
        username: "BandarasJ",
        email : "joe212@gmail.com",
        contacts : "+27695050560",
        password : "joe22HS20."
    },
    {
        userID : 2,
        username: "BillFx",
        email : "bill456@gmail.com",
        contacts : "+27312387001",
        password : "billMG121."
    }],
    paymentDetails:[ {
        userID : 0, 
        name : "Ben",
        surname : "Shapiro",
        cardNumber : 5488788990546566,
        cvv : 218,
        expiryDate: "12/28"
    },
    {
        userID : 1, 
        name : "Joe",
        surname : "Bandaras",
        cardNumber : 2458947545435834,
        cvv : 206,
        expiryDate: "09/29"
    },
    {
        userID : 2, 
        name : "Bill",
        surname : "Fox",
        cardNumber : 3456546544565777,
        cvv : 509,
        "expiryDate": "03/27"
    }],
    userCreditDetails:[ 
    {
        userID : 0, 
        subscriptionFee: 100,
        period: "1 month",
        cutCountRemaining : 2,
        balance : 50,
        dates_allocated : ["01/07/2025", "07/07/2025", "15/07/2025", "22/07/2025"]
    },
    {
        userID : 1, 
        subscriptionFee: 100,
        period: "1 month",
        cutCountRemaining : 3,
        balance : 75,
       dates_allocated : ["01/07/2025", "07/07/2025", "15/07/2025", "22/07/2025"]
    },
    {
        userID : 2, 
        subscriptionFee: 100,
        period: "1 month",
        cutCountRemaining : 1,
        balance : 25,
        dates_allocated : ["01/07/2025", "07/07/2025", "15/07/2025", "22/07/2025"]
    }]
}

module.exports = database;