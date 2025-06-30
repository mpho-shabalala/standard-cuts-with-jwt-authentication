
const authenticationRouter = require('./Routes/authenticationRoutes');
const paymentDetailsRouter = require('./Routes/paymentDetailsRoutes');
const userCreditDetailsRouter = require('./Routes/userCreditDetailsRouters');
const userFullDetailsRouter = require('./Routes/userFullDetailsRoutes');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const authenticateToken = require('./middlewares/authenticateToken')
require('dotenv').config();

//intantiate express app
const app = express();

//set up middlewares
app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
// block chrome's favicon router
app.use('/favicon.ico', (req, res) => {
    res.status(404).end();
});

app.use('/api/v1/authentication', authenticationRouter);
app.use('/api/v1/payment',authenticateToken, paymentDetailsRouter);
app.use('/api/v1/user_credit',authenticateToken, userCreditDetailsRouter);
app.use('/api/v1/user',authenticateToken, userFullDetailsRouter);

app.all('*', (req, res, next) => {
    next(new Error(`Can't find ${req.originalUrl} on the server`, 404));
  });
module.exports = app;