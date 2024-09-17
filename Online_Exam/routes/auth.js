const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ronaldocr741416@gmail.com',
      pass: 'zjqr pfyx xeuq kaui'
    }
  });
// Register
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username,mailid, password } = req.body;
    try {
        const user = new User({ username,mailid, password });
        await user.save();
        const mailOptions = {
            from: 'ronaldocr741416@gmail.com',
            to: mailid,
            subject: 'register Notification',
            text: `User ${username} has Registered in.`
          };
      
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(500).send('Error sending email: ' + error.message);
            }
            console.log('Login successful and email sent: ' + info.response);
            res.redirect('/login');
    });
    } catch (err) {
        res.status(400).send('Error registering user try different userName');
    }
});

// Login
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await user.comparePassword(password)) {
        const token = jwt.sign({ _id: user._id }, 'secretkey', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/exams');
    } else {
        res.status(400).send('Invalid credentials');
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;