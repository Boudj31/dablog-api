const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;


exports.tokenInterceptor = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json('Token invalide');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(401).send("Invalid Token");

        req.user = user

        next()
    })
}