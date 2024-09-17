const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const Exam = require('../models/Exam');
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminauth');

// Admin registration
router.get('/admin/register', (req, res) => {
    res.render('adminregister');
});

router.post('/admin/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = new Admin({ username, password });
        await admin.save();
        res.redirect('/admin/login');
    } catch (err) {
        res.status(400).send('Error registering user try different userName');
    }
});

// Admin Login
router.get('/admin/login', (req, res) => {
    res.render('adminLogin');
});

router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (admin && await admin.comparePassword(password)) {
        const token = jwt.sign({ _id: admin._id }, 'adminsecretkey', { expiresIn: '1h' });
        res.cookie('adminToken', token, { httpOnly: true });
        res.redirect('/admin/exams');
    } else {
        res.status(400).send('Invalid credentials');
    }
});

router.get('/admin/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
});

// Admin Exam Management
router.get('/admin/exams', adminAuth, async (req, res) => {
    const exams = await Exam.find();
    res.render('adminExams', { exams });
});

router.get('/admin/exams/new', adminAuth, (req, res) => {
    res.render('newExam');
});

router.post('/admin/exams', adminAuth, async (req, res) => {
    const { title,questions, duration } = req.body;
    const exam = new Exam({ title, questions, duration });
    await exam.save();
    res.redirect('/admin/exams');
});

router.get('/admin/exams/:id/edit', adminAuth, async (req, res) => {
    const exam = await Exam.findById(req.params.id);
    res.render('editExam', { exam });
});

router.post('/admin/exams/:id', adminAuth, async (req, res) => {
    const { title, questions, duration } = req.body;
    const [minutes, seconds] = duration.split(':').map(Number);
    if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        return res.status(400).send('Invalid duration format. Please use MM:SS format.');
    }

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
        return res.status(404).send('Exam not found');
    }

    exam.title = title;
    exam.duration = duration;
    exam.questions = questions;

    await exam.save();

    // Debugging: Log the incoming data
    console.log('Received data:', req.body);

    // Convert correctOption to number if it's a string
    questions.forEach(question => {
        question.answer = Number(question.answer);
    });

    try {
        await Exam.findByIdAndUpdate(req.params.id, { title, questions, duration });
        res.redirect('/admin/exams');
    } catch (error) {
        console.error('Error updating exam:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/admin/exams/:id/delete', adminAuth, async (req, res) => {
    await Exam.findByIdAndDelete(req.params.id);
    res.redirect('/admin/exams');
});

module.exports = router;