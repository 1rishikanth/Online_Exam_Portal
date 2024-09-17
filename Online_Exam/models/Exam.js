const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: [
        {
            question: String,
            options: [String],
            answer: String
        }
    ],
    startTime: Date,
    endTime: Date,
    duration: { 
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{1,2}:\d{2}$/.test(v); // Validates MM:SS format
            },
            message: props => `${props.value} is not a valid duration format!`
        }
    }
});

module.exports = mongoose.model('Exam', examSchema);
