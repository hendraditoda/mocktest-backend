const db = require('../../models');
const User = db.users;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'gatot.sprinter@gmail.com',
//     pass: process.env.GOOGLE_APP_PASSWORD,
//   },
// });
module.exports = {
  getSession: async (req, res) => {
    try {
      const userId = req.session.userId;
      return res.status(200).json({ userId });
    } catch (err) {
      console.log(err);
    }
  },
  userData: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(400).json({
          result: 'ERROR',
          msg: 'Error occured while retrieving data',
        });
      }
      res.status(200).json({
        result: 'Success',
        data: user,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getUser: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'email'],
      });
      res.json(users);
    } catch (error) {
      console.log(error);
    }
  },
  register: async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const userExist = await User.findOne({ where: { username } });
      const emailExist = await User.findOne({ where: { email } });
      if (userExist || emailExist) {
        return res.status(409).json({ msg: 'username atau email sudah terpakai' });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user
      const newUser = await User.create({
        id: uuidv4(),
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      // Send a success response
      res.status(201).json({ msg: 'Registrasi Berhasil' });
    } catch (error) {
      console.log(error);
      // Send an error response
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  login: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (!user) {
        return res.status(404).json({ msg: 'Email Tidak Ditemukan' });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Password Salah' });
      }
      const userId = user.id;
      const username = user.username;
      const email = user.email;
      const accessToken = jwt.sign({ userId, username, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '20s',
      });
      req.session.userId = userId;
      req.session.username = username;
      req.session.email = email;
      res.json({ msg: 'Login berhasil', accessToken, userId });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  //   forgotPassword: async (req, res) => {
  //     try {
  //       const { email } = req.body;
  //       const user = await User.findOne({ where: { email } });

  //       if (!user) {
  //         return res.status(404).json({ msg: 'Email tidak ditemukan' });
  //       }

  //       const resetToken = jwt.sign({ userId: user.id, email }, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });

  //       const mailOptions = {
  //         from: 'gatot.sprinter@gmail.com',
  //         to: email,
  //         subject: 'Reset Password',
  //         html: `
  //           <h1>Reset Password</h1>
  //           <p>CODE : <strong>${resetToken}</strong></p>
  //           <p>Input the code above with your new password on this <a href="https://api-gatot-sprinter.niceblue.my.id/resetpassword"> LINK </a> to reset your password</p>
  //         `,
  //       };

  //       try {
  //         const info = await transporter.sendMail(mailOptions);
  //         console.log('Email sent: ' + info.response);
  //         res.json({ msg: 'Email reset password telah dikirim', resetToken });
  //       } catch (error) {
  //         console.log(error);
  //         return res.status(500).json({ error: 'Internal server error' });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       res.status(500).json({ error: 'Internal server error' });
  //     }
  //   },
  resetPassword: async (req, res) => {
    try {
      const { resetToken, password } = req.body;
      const decodedToken = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);
      if (!decodedToken) {
        return res.status(400).json({ msg: 'Token reset password tidak valid' });
      }
      const { userId, email } = decodedToken;
      const user = await User.findOne({ where: { id: userId, email } });
      if (!user) {
        return res.status(404).json({ msg: 'User tidak ditemukan' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ msg: 'Reset password berhasil' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findOne({ where: { id: userId } });
      const { username, email, oldPassword, newPassword } = req.body;
      // Fetch the user from the database
      // Check if the updated username or email is already in use
      if (username && username !== user.username) {
        const usernameExist = await User.findOne({ where: { username } });
        if (usernameExist) {
          return res.status(409).json({ msg: 'Username already in use' });
        }
        user.username = username;
      }
      if (email && email !== user.email) {
        const emailExist = await User.findOne({ where: { email } });
        if (emailExist) {
          return res.status(409).json({ msg: 'Email already in use' });
        }
        user.email = email;
      }
      if (oldPassword && newPassword) {
        // Check if the old password matches the one in the database
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({ msg: 'Invalid old password' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
      } else if (newPassword !== undefined && newPassword !== null) {
        return res.status(400).json({ msg: 'Old password and new password are required' });
      }
      // Save the updated user
      await user.save();
      res.json({ msg: 'Profile updated successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  logout: async (req, res) => {
    try {
      req.session.destroy();
      res.json({ msg: 'Logout berhasil' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
