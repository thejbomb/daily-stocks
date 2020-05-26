const sendEmail = require('./email');
const bcrypt = require('bcrypt');

const handleRegister = (req, res, client, connect, stocks) => {
  const {email, password, companies} = req.body;
  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      return res.status(400).json('incorrect form submission');
    }

    let companyList = companies.map((company) => { return stocks.get(company) })
    let user = req.body;

    user.password = hash;
    user.companies = companyList;

    connect.then(() => {     
      client.db("stocksDb")
      .collection("Users")
      .insertOne(user)
      .then(() => {
        res.json(companyList);
      })
      .then(() => {
        const msg = `Thank you for registering to Stocks-daily!\nYour account password is ${password}.`
        sendEmail(email, msg);
      })
      .catch(err => console.log(err));
    })
    .catch(err => res.status(400).json('unable to register'));
  })
}

module.exports = {
  handleRegister: handleRegister
}