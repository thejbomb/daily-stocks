const sendEmail = require('./email');
const schedule = require('node-schedule');

require('dotenv').config();
const alpha = require('alphavantage')({key: process.env.ALPHA_VANTAGE_API_KEY});
const { companies } = require('../constants');
const { Stock } = require('./Stock');

let stocks = new Map();

//scheduled daily API requests and database lookup
const sendNotification = (client, connect) => {
    stocks = new Map();
    schedule.scheduleJob('*/1 * * * *', function() {
        companies.forEach(getStockPrices);
        handleNotification(client, connect);
    });
    
    return stocks;
}

//API request to alpha for stock prices
function getStockPrices(company) {
    alpha.data.quote(company).then(data => {
        let price = data['Global Quote']['05. price'];
        let stock = new Stock(company, price);
        stocks.set(company, stock);
    })
    .catch(err => console.log("Too many requests to alpha api"));
}

//database iteration of whole collection
const handleNotification = (client, connect) => {
    if (stocks.size > 0) {
        connect.then(() => {     
            client.db("stocksDb")
            .collection("Users")
            .find({}, function(err, users) {
                if (err) throw err;
    
                users.forEach(user => {
                    let msg = '';
                    if (user) {
                        msg = handleNotificationMsg(user);
                        console.log(msg)
                    }
                    if (msg.length > 0) {
                        sendEmail(user.email, msg)
                    }
                })
            })
        })
        .catch(err => console.log(err))
    }
}

//compiled msg based on price comparisons
const handleNotificationMsg = (user) => {
    const updateMsg = 'Update from Daily Stocks\n\n'
    const incMsgHeader = 'The companies listed below have increased by at least 50% today: \n';
    const decMsgHeader = 'The companies listed below have decreased by at least 50% today: \n';
    const { companies, increase, decrease } = user;
    let msgInc = '', msgDec = '', msg = '';
    const inc = 1.5, dec = 0.5;

    companies.forEach(company => {
        const name = company.name;
        const today = stocks.get(name).price, prev = company.price;

        if (increase && (prev * inc) <= today) {
            msgInc = msgInc + `${name}\n`
        }
        if (decrease && (prev * dec) >= today) {
            msgDec = msgDec + `${name}\n`
        }
    })

    if (msgInc.length > 0 && msgDec.length > 0) {
        msg = updateMsg + incMsgHeader + msgInc + '\n\n' + decMsgHeader + msgDec;
    }
    else if (msgInc.length > 0) {
        msg = updateMsg + incMsgHeader + msgInc;
    }
    else if (msgDec.length > 0) {
        msg = updateMsg + decMsgHeader + msgDec;
    }
    
    return msg;
}

module.exports = {
    handleNotification: handleNotification,
    sendNotification: sendNotification
}