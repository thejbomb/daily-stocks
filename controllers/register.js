const sendEmail = require('./email');

const handleRegister = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
}

module.exports = {
    handleRegister: handleRegister
}