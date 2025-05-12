import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      req.user = null;
      return next();
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        req.user = null;
      } else {
        req.user = decoded;
      }
      next();
    });
};

export function requireEnseignant(req, res, next) {
    if (req.user.role !== 'enseignant') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
}