const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(user, token)
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticateToken;
