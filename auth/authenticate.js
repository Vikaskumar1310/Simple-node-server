const jwt = require('jsonwebtoken');
const User = require('../models/user');

let auth = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisisfreelancejwt');
        console.log("decoded", decoded )
        const user = await User.findOne({ email : decoded.email });
        console.log("user", user)
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    }catch(err){
        res.status(401).send({ Error: "Please authenticate." });
    }
}
module.exports = auth;