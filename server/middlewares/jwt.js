const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const jwt = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).send({ error: 'No token provided!' });
  }
  jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Unauthorized!' });
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  });
};

module.exports = { jwt };