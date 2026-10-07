const jwt = require('jsonwebtoken');

function checkAuthenticated(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({ message: 'Not looged in'});
    }
        
        const token = authHeader.split(' ')[1];
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
            next();
        } catch(e){
            return res.status(401).json({ message: 'Invalid or expired token'});
        }
}

function requireUser(req, res, next){
    if (req.user.guest){
        return res.status(403).json({ messaage: 'Guests cannot save tasks'});
    }
    next();
}

module.exports = checkAuthenticated;
module.exports.requireUser = requireUser;