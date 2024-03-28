import jwt from "jsonwebtoken";

class JwtStrategy {
  constructor() {
    this.secret = 'your-secret-key'; // Replace with your actual secret key
  }

  initialize() {
    // Any initialization logic for JWT strategy
  }

  authenticate(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, this.secret);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
}

export default  new JwtStrategy();
