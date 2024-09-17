
const express = require('express');
const mongoose=require('mongoose');
const router = express.Router();
const Result = require('../models/Result');
const auth = require('../middleware/auth');

router.get('/result/:id', auth, async (req, res) => {
    try {
        const resultId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(resultId)) {
            return res.status(400).send('Invalid Result ID');
        }

        const result = await Result.findById(resultId).populate('exam').populate('user');
        if (!result) {
            return res.status(404).send('Result not found');
        }

        res.render('result', { result });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
router.post('/result/:id',auth,async(req,res)=>{
    res.redirect('http://localhost:3000/login');
});

module.exports = router;