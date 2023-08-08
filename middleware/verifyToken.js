const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken: async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken && !req.session.email && !req.user) {
      return res.sendStatus(401);
    }

    try {
      if (accessToken) {
        // Verifying JWT token
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        req.nickname = decoded.nickname;
        req.email = decoded.email;
      }

      next();
    } catch (error) {
      console.log(error);
      res.sendStatus(403);
    }
  },
};
