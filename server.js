const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const schedule = require('node-schedule');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const alpha = require('alphavantage')({key: process.env.ALPHA_VANTAGE_API_KEY});

const register = require('./controllers/register');
const signin = require('./controllers/signin');

const { companies } = require('./constants');
const { Stock } = require('./controllers/Stock');

let stocks = [];
let url = "mongodb://localhost:27017/stocksDb";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //connect to stocksDb
    let dbo = db.db('stocksDb');
    //document
    let obj = { email: "1@gmail.com", password: "123", companies: ['azm', 'msft'], inc: 30, dec: 0};
    //creates collection/table
    dbo.createCollection("users", function(err, res) {
        if (err) throw err;
        console.log("collection created")
    })
    //inserts document
    dbo.collection("users").insertOne(obj);
    //find document
    dbo.collection("users").findOne({email: "1@gmail.com"});
    //update
    dbo.collection("users").updateOne({email: "1@gmail.com"}, { email: "1@gmail.com", password: "12333333333", companies: ['azm', 'msft'], inc: 30, dec: 0})
    db.close;
})

const app = express();

app.use(cors());
app.use(bodyParser.json());

//companies.forEach(myFunction);

function myFunction(companies, index) {
    alpha.data.quote(companies).then(data => {
        let price = data['Global Quote']['05. price'];
        let s = new Stock(companies, price);
        stocks.push(s);
    
        console.log(index + " : " + s.name + " : " + s.price);
    })
}

let job = schedule.scheduleJob('00 00 12 * * 0-6', function() {
    console.log("check stocks")
});

app.get('/', (req, res)=> { res.send('it is working!') })
app.get('/signin', (req, res) => { signin.handleSignin(req, res)});
app.post('/register', (req, res) => { register.handleRegister(req, res)});
app.post('/update')

app.listen(3001, () => {
    console.log("app running on 3001")
})