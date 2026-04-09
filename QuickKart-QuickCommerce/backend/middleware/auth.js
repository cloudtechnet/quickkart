const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const vendorOnly = (req, res, next) => {
  if (req.user?.role !== 'vendor') {
    return res.status(403).json({ message: 'Vendor access required' });
  }
  next();
};

const userOnly = (req, res, next) => {
  if (req.user?.role !== 'user' && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'User access required' });
  }
  next();
};

module.exports = { authMiddleware, vendorOnly, userOnly };
