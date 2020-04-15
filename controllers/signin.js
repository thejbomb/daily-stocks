const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
}

module.exports = {
    handleSignin: handleSignin
}