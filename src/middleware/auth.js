const jwt = require('jsonwebtoken')

const isLoggedIn = (req, res, next) => {

const token = req.header('Authorization')?.replace("Bearer ", "");

if (!token) {

return res.status(401).json({ message: "Token not found" });

}

try {

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded Token:", decoded);

    if (!decoded.userId || typeof decoded.isAdmin !== 'boolean' || !decoded.firstName ) 
        return res.status(400).json({ message: "Invalid token structure "});

    req.user ={ 
        userId: decoded.userId,
        firstName: decoded.firstName,
        isAdmin: decoded.isAdmin,
        email: decoded.email
};

next();

} catch (error) {
console.error("JWT Error:", error );
return res.status(400).json({ message: 'Invalid or expired token', error: error.message });
}

};



module.exports = isLoggedIn



