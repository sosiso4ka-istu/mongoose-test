const mongoose = require('mongoose');
const { User, Course, Lesson, Homework } = require('./entities');
let randomCourseId = null;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

async function createUser(username, role) {
    console.log('----- створення користувача -----')
    const user = new User({ username, role });
    const start = Date.now();
    const result = await user.save();
    const end = Date.now();
    console.log(`Користувач ${username} (${role}) створен, ${end - start}ms`);
    console.log('\n')
}

async function createCourse(title, description, teacherId, lessonCount) {
    console.log('----- створення курсу -----')
    const course = new Course({ title, description, teacher: teacherId, lessonCount });
    const start = Date.now();
    const result = await course.save();
    const end = Date.now();
    console.log(`Курс ${title} створено, ${end - start}ms`);
    console.log('\n')
}

async function createLesson(title, number, instructions, showAtDay, courseId, homeworkId) {
    console.log('----- створення уроку -----')
    const lesson = new Lesson({ title, number, instructions, showAtDay, course: courseId, homework: homeworkId });
    const start = Date.now();
    const result = await lesson.save();
    const end = Date.now();
    console.log(`Урок ${title} створено, ${end - start}ms`);
    console.log('\n')
}

async function createHomework(title, description, attachments) {
    console.log('----- створення ДЗ -----')
    const homework = new Homework({ title, description, attachments });
    const start = Date.now();
    const result = await homework.save();
    const end = Date.now();
    console.log(`Дз ${title} створено, ${end - start}ms`);
    console.log('\n')
}

async function getAllCourses() {
    console.log('----- отримання всіх курсів -----')
    const start = Date.now();
    const courses = await Course.find().select('title').lean();
    randomCourseId = courses[1]._id;
    const end = Date.now();
    console.log(`Кількість курсів: ${courses.length}, ${end - start}ms`);
    console.log('\n')
}

async function getLessonsByCourse(courseId) {
    console.log('----- отримання всх уроків курсу -----')
    const start = Date.now();
    const lessons = await Lesson.find({ course: courseId }).select('title').lean();
    const end = Date.now();
    console.log(`Кількість уроків курса: ${lessons.length}, ${end - start}ms`);
    console.log('\n')
}

async function deleteRandomLessonAndHomework() {
    console.log("----- видалення уроку і його дз -----")
    const start = Date.now();
    try {
        const lessons = await Lesson.find().select('_id').lean();
        const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];

        const homeworkIds = randomLesson.homework;
        await Homework.deleteMany({ _id: { $in: homeworkIds } });
        console.log(`Видалено ДЗ ${randomLesson._id}`);

        const lessonId = randomLesson._id;
        await Lesson.deleteOne({ _id: lessonId });
        console.log(`Видалено урок ${lessonId}`);

        const end = Date.now();
        console.log(`Сумарно ${end - start}ms`);
    } catch (error) {
        console.error('Ошибка:', error);
    }
    console.log('\n')
}

async function deleteRandomCourseAndLessonsAndHomeworks() {
    console.log('----- Видалення курсу + уроків + ДЗ -----')
    const start = Date.now();
    try {
        const courses = await Course.find().select('_id').lean();
        const randomCourse = courses[Math.floor(Math.random() * courses.length)];

        const lessonsWithHomeworks = await Lesson.find({ course: randomCourse._id }).select('homework').lean();
        const homeworkIds = lessonsWithHomeworks.map(lesson => lesson.homework);
        await Homework.deleteMany({ _id: { $in: homeworkIds } });
        console.log(`Видалені ДЗ курса ${randomCourse._id}`);

        await Lesson.deleteMany({ course: randomCourse._id });
        console.log(`Видалені уроки курса ${randomCourse._id}`);

        await Course.deleteOne({ _id: randomCourse._id });
        console.log(`Видалено курс ${randomCourse._id}`);

        const end = Date.now();
        console.log(`Сумарно ${end - start}ms`);
    } catch (error) {
        console.error('Ошибка:', error);
    }
    console.log('\n')
}


async function main() {
    await createUser('JohnDoe', 'student');
    await createUser('JaneDoe', 'teacher');
    await createHomework('Homework 1', 'Description for Homework 1', ['attachment1.pdf', 'attachment2.docx']);
    await createCourse('Course 1', 'Description for Course 1', null, 1);
    await createLesson('Lesson 1', 1, 'Instructions for Lesson 1', 1, null, null);
    await deleteRandomLessonAndHomework();
    await deleteRandomCourseAndLessonsAndHomeworks();
    await getAllCourses();
    await getLessonsByCourse(randomCourseId);
    mongoose.disconnect();
}

main().catch(err => console.error('Error:', err));
