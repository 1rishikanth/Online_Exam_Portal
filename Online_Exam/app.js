const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Exam = require('./models/Exam');
const app = express();

mongoose.connect('mongodb://localhost:27017/online-exam-portal', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log("Database connected");

    // Check if there are any exams in the database
    const existingExams = await Exam.find({});
    if (existingExams.length === 0) {
        const exams = [
            {
                title: "Math Test",
                description: "Basic Math Test",
                questions: [
                    {
                        question: "What is 2 + 2?",
                        options: ["3", "4", "5", "6"],
                        answer: 1
                    },
                    {
                        question: "What is 3 * 3?",
                        options: ["6", "7", "8", "9"],
                        answer: 3
                    }
                ],
                duration: "00:30" // Set duration to 30 seconds
            },
            {
                title: "Science Test",
                description: "Basic Science Test",
                questions: [
                    {
                        question: "What planet is known as the Red Planet?",
                        options: ["Earth", "Mars", "Jupiter", "Saturn"],
                        answer: 1
                    },
                    {
                        question: "What is the chemical symbol for water?",
                        options: ["HO", "O2", "H2O", "CO2"],
                        answer: 2
                    }
                ],
                duration: "00:30" // Set duration to 30 seconds
            }
        ];

        await Exam.insertMany(exams);
        console.log("Exams have been seeded");
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/', require('./routes/admin'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/exam'));
app.use('/', require('./routes/result'));
app.get("/", (req, res) => {
    res.render("home.ejs");
});
app.get("/about", (req, res) => {
    res.render("about.ejs");
});
app.get("/service", (req, res) => {
    res.render("Service.ejs");
});
app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});
app.get("/team", (req, res) => {
    res.render("team.ejs");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
