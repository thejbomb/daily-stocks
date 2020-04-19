const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const schedule = require('node-schedule');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const alpha = require('alphavantage')({key: process.env.ALPHA_VANTAGE_API_KEY});

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const notification = require('./controllers/notification');

const { companies } = require('./constants');
const { Stock } = require('./controllers/Stock');

const client = MongoClient(process.env.MONGODB_URI, {useUnifiedTopology: true});

const connection = client.connect()
.then(() => console.log("Db connected"))
.catch(err => console.log(`DB Connection Error: ${err.message}`));

const connect = connection;
const app = express();

app.use(cors());
app.use(bodyParser.json());

let stocks = new Map();

function getStockPrices(company) {
    alpha.data.quote(company).then(data => {
        let price = data['Global Quote']['05. price'];
        let stock = new Stock(company, price);
        stocks.set(company, stock);
    })
    .catch(err => console.log("Too many requests to alpha api"));
}

schedule.scheduleJob('00 00 12 * * 0-6', function() {
    stocks = new Map();
    companies.forEach(getStockPrices);
    notification.handleNotification(client, connect, stocks);
});

app.get('/', (req, res)=> { res.send('it is working!') })
app.post('/signin', (req, res) => { signin.handleSignin(req, res, client, connect, stocks)});
app.post('/register', (req, res) => { register.handleRegister(req, res, client, connect, stocks)});
app.post('/update')

app.listen(3001, () => {
    console.log("app running on 3001")
})