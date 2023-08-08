const db = require('../models');
const User = db.users;

module.exports = {
  logout: async (req, res) => {
    try {
      req.session.destroy();
      res.clearCookie('userId');
      res.clearCookie('connect.sid');
      res.status(200).json({ msg: 'Logout berhasil' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
