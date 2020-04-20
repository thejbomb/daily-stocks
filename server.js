const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { MongoClient } = require('mongodb');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const notification = require('./controllers/notification');

const client = MongoClient(process.env.MONGODB_URI, {useUnifiedTopology: true});

const connection = client.connect()
.then(() => console.log("Db connected"))
.catch(err => console.log(`DB Connection Error: ${err.message}`));

const connect = connection;
const app = express();

app.use(cors());
app.use(bodyParser.json());

//daily stocks retreival and notification calls
let stocks = notification.sendNotification(client, connect);

app.get('/', (req, res)=> { res.send('it is working!') })
app.post('/signin', (req, res) => { signin.handleSignin(req, res, client, connect, stocks)});
app.post('/register', (req, res) => { register.handleRegister(req, res, client, connect, stocks)});
app.post('/update')

app.listen(3001, () => {
    console.log("app running on 3001")
})