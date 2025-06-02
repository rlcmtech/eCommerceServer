const isVerified = (req, res, next) => {

if (!req.user || req.user.isVerified !== true) {
    return res.status(403).json({message: "Please verify your account to proceed."})
}
next();
};

module.exports = isVerified;