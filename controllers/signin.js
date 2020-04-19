const bcrypt = require('bcrypt');

const handleSignin = (req, res, client, connect, stocks) => {
    const { email, password } = req.body;
    
    connect.then(() => {     
        client.db("stocksDb")
        .collection("Users")
        .findOne({email: email})
        .then(data => {
            bcrypt.compare(password, data.password, function(err, result) {
                if (result) {
                    let companies = data.companies;
                    let companyList = companies.map(company => {
                        return stocks.get(company.name);
                    })
                    res.json(companyList);
                }
                else {
                    res.status(400).json('wrong credentials');
                }
            })            
        })
        .catch(err => console.log(err))
    })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleSignin: handleSignin
}