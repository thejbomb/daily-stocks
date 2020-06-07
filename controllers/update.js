/**
 * This function handles the stock list updates for the users, adding additional stock to the mongodb database
 * 
 * @param {*} req The http request
 * @param {*} res The http response
 * @param {*} client The mongodb client
 * @param {*} connect The mongodb connection to the database
 * @param {Map} stocks The Map of all stocks and their prices for the day
 */
const handleUpdate = (req, res, client, connect, stocks) => {
  const {company, email} = req.body;
  
  if (stocks.has(company)) {
    res.json(stocks.get(company));
  } else {
    res.json(400).json('company not included');
  }
  
  //updates the user's document on the mongodb database
  connect.then(() => {     
    client.db("stocksDb")
    .collection("Users")
    .updateOne({ email: email }, { $push: { "companies": { $each: stocks.get(company) } } })
    .done(function(err, update) {
        console.log("update " + JSON.stringify(update));
    })
    .catch(err => console.log(err));
  })
  .catch(err => res.status(400).json('unable to register'));
}

module.exports = {
    handleUpdate: handleUpdate
}