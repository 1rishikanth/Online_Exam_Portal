const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Exam = require('../models/Exam');
const Result = require('../models/Result');

// Get all exams
 router.get('/exams', auth, async (req, res) => {
     const exams = await Exam.find();
     res.render('exams', { exams });
 });

// Get exam by ID
router.get('/exams/:id', auth, async (req, res) => {
    const id=req.params.id;
    const exam = await Exam.findById(id);
    res.render('exam', { exam });
});

// Submit exam
router.post('/exam/submit', auth, async (req, res) => {

    try {
        const { examId, answers } = req.body;
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).send('Exam not found');
        }

        // Calculate score
        let score = 0;
        exam.questions.forEach((question, index) => {
            console.log(`Question ${index + 1}: Correct Answer: ${question.answer}, Submitted Answer: ${answers[index]}`);
            if (question.answer == parseInt(answers[index])) {
                score++;
            }
        });

        // Save result to the database
        const result = new Result({
            user: req.user._id,
            exam: examId,
            score: score,
            total: exam.questions.length
        });
        await result.save();

        // Redirect to the result page
        res.redirect(`/result/${result._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;