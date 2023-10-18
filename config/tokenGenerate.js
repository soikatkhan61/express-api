const jwt = require("jsonwebtoken");

const tokenGenerator = (userId, expireDate, isAdmin="") => {
    const token = jwt.sign(
        {
            id: userId,
            isAdmin: isAdmin
        },
        process.env.JWT_SEC,
        { expiresIn: expireDate }
    );

    return token;
}

module.exports = {tokenGenerator};