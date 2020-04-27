const handleUpdate = (req, res, client, connect, stocks) => {
    const { company, email } = req.body;
    console.log(company);
    
    if (stocks.has(company)) {
        res.json(stocks.get(company));
        console.log(stocks.get(company))
    }
    else {
        res.json(400).json('company not included');
    }
    //{ $push: { "attachments":{$each: arr} } }
    connect.then(() => {     
        client.db("stocksDb")
        .collection("Users")
        .updateOne({email: email}, { $push: { "companies": {$each: stocks.get(company) }}})
        .done(function(err, update) {
            console.log("update " + JSON.stringify(update));
        })
        .catch(err => console.log(err))
    })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleUpdate: handleUpdate
}