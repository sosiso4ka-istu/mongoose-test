const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Схема пользователя
const userSchema = new Schema({
    username: String,
    role: { type: String, enum: ['student', 'teacher', 'admin'] },
    courses: [{
        course: { type: Schema.Types.ObjectId, ref: 'Course' },
        startDate: Date
    }],
    completedHws: [{ type: Schema.Types.ObjectId, ref: 'Homework' }],
});

// Схема курса
const courseSchema = new Schema({
    title: String,
    description: String,
    teacher: { type: Schema.Types.ObjectId, ref: 'User' },
    lessonCount: Number,
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
});

// Схема урока
const lessonSchema = new Schema({
    title: String,
    number: Number,
    instructions: String,
    showAtDay: Number,
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    homework: { type: Schema.Types.ObjectId, ref: 'Homework' },
});

// Схема домашнего задания
const homeworkSchema = new Schema({
    title: String,
    description: String,
    attachments: [String],
});

const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const Homework = mongoose.model('Homework', homeworkSchema);

module.exports = { User, Course, Lesson, Homework };
