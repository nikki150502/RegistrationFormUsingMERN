const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
    try {
        // const token = req.cookies.jwttoken;
        const token = req.cookies.jwt
         
        if (!token) {
            throw new Error('Token not provided');
        }

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootuser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootuser) {
            throw new Error('User not found');
        }

        req.token = token;
        req.rootuser = rootuser;
        req.userID = rootuser._id; // Corrected variable name

        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).send('Unauthorized: Token expired');
        } else if (err.name === 'JsonWebTokenError') {
            res.status(401).send('Unauthorized: Invalid token');
        } else {
            res.status(401).send('Unauthorized: No token provided');
        }
        console.log(err);
    }
}

module.exports = authenticate;
