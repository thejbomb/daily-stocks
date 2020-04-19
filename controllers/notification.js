const sendEmail = require('./email');

const handleNotification = (client, connect, stocks) => {

    connect.then(() => {     
        client.db("stocksDb")
        .collection("Users")
        .find()
        .then(user => {
            const msg = handleNotificationMsg(user);

            if (msg.length > 0) {
                sendEmail(user.email, msg)
            }
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log('database connection error'))
}

const handleNotificationMsg = (user) => {
    const incMsgHeader = 'The companies listed have increased by 50% today: \n';
    const decMsgHeader = 'The companies listed have decreased by 50% today: \n';
    const { companies, increase, decrease } = user;
    let msgInc = '', msgDec = '', msg = '';
    const inc = 1.5, dec = 0.5;

    companies.forEach(company => {
        const name = company.name;
        const today = stocks.get(name).price, prev = company.price;

        if (increase && (prev * inc) === today) {
            msgInc.append(`${name}\n`)
        }
        if (decrease && (prev * dec) === today) {
            msgDec.append(`${name}\n`)
        }
    })

    if (increase && decrease) {
        msg.append(incMsgHeader + msgInc + '\n' + decMsgHeader + msgDec);
    }
    else if (increase) {
        msg.append(incMsgHeader + msgInc);
    }
    else if (decrease) {
        msg.append(decMsgHeader + msgDec);
    }
    
    return msg;
}

module.exports = {
    handleNotification: handleNotification
}