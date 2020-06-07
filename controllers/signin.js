const bcrypt = require('bcrypt');

/**
 * Handles signin api calls, retrieves the user documents from the database and returns it 
 * @param {*} req The http request
 * @param {*} res The http response
 * @param {*} client The mongodb client
 * @param {*} connect The mongodb database connection
 * @param {Map} stocks The Map of all stocks and their prices for the day
 */
const handleSignin = (req, res, client, connect, stocks) => {
  const {email, password} = req.body;
  
  connect.then(() => {     
    client.db("stocksDb")
    .collection("Users")
    .findOne({ email: email })
    .then((data) => {
      bcrypt.compare(password, data.password, function(err, result) {
        if (result) {
          let companies = data.companies;
          let companyList = companies.map((company) => {
            return stocks.get(company.name);
          })
          res.json(companyList);
        } else {
          res.status(400).json('wrong credentials');
        }
      })            
    })
    .catch(err => console.log(err));
  })
  .catch(err => res.status(400).json('unable to register'));
}

module.exports = {
    handleSignin: handleSignin
}