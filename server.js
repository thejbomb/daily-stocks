const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
const cors = require('cors');
const fetch = require('node-fetch');
const schedule = require('node-schedule');
const alpha = require('alphavantage')({key: process.env.ALPHA_VANTAGE_API_KEY});
const sendEmail = require('./controllers/email');
const { Stock } = require('./controllers/Stock');

let stocks = [];

const app = express();

app.use(cors());
app.use(bodyParser.json());

let job = schedule.scheduleJob('00 00 12 * * 0-6', function() {
    console.log("check stocks")
});

alpha.data.quote('msft').then(data => {
    let price = data['Global Quote']['05. price'];

    console.log(price);
})

app.listen(3001, () => {
    console.log("app running on 3001")
})