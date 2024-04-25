const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'qfqg5h8b',
    port: 5432,
});

async function createUser(username, role) {
    console.log('----- Створення користувача -----');
    const query = 'INSERT INTO users (username, role) VALUES ($1, $2) RETURNING *';
    const start = Date.now();
    const result = await pool.query(query, [username, role]);
    const end = Date.now();
    console.log(`Користувач ${result.rows[0].username} (${result.rows[0].role}) створений, ${end - start}ms`);
    console.log('\n');
}

async function createCourse(title, description, teacherId, lessonCount) {
    console.log('----- Створення курсу -----');
    const query = 'INSERT INTO courses (title, description, teacher_id, lesson_count) VALUES ($1, $2, $3, $4) RETURNING *';
    const start = Date.now();
    const result = await pool.query(query, [title, description, teacherId, lessonCount]);
    const end = Date.now();
    console.log(`Курс ${result.rows[0].title} створений, ${end - start}ms`);
    console.log('\n');
}

async function createLesson(title, number, instructions, showAtDay, courseId, homeworkId) {
    console.log('----- Створення уроку -----');
    const query = 'INSERT INTO lessons (title, number, instructions, show_at_day, course_id, homework_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const start = Date.now();
    const result = await pool.query(query, [title, number, instructions, showAtDay, courseId, homeworkId]);
    const end = Date.now();
    console.log(`Урок ${result.rows[0].title} створений, ${end - start}ms`);
    console.log('\n');
}

async function createHomework(title, description, attachments) {
    console.log('----- Створення домашнього завдання -----');
    const start = Date.now();
    const getMaxIdQuery = 'SELECT MAX(id) AS max_id FROM public.homeworks';
    const maxIdResult = await pool.query(getMaxIdQuery);
    const maxId = maxIdResult.rows[0].max_id || 0;

    const nextId = maxId + 1;

    const query = 'INSERT INTO public.homeworks (id, title, description, attachments) VALUES ($1, $2, $3, $4) RETURNING *';
    try {
        const result = await pool.query(query, [nextId, title, description, attachments]);
        const end = Date.now();
        console.log(`Домашнє завдання ${result.rows[0].title} створено, ${end - start}ms`);
        console.log('\n');
    } catch (error) {
        console.error('Помилка при створенні домашнього завдання:', error);
    }
}


async function getAllCourses() {
    console.log('----- Отримання всіх курсів -----');
    const query = 'SELECT * FROM courses';
    const start = Date.now();
    const result = await pool.query(query);
    const end = Date.now();
    randomCourseId = result.rows[1].id;
    console.log(`Кількість курсів: ${result.rowCount}, ${end - start}ms`);
    console.log('\n');
}

async function getLessonsByCourse(courseId) {
    console.log('----- Отримання всіх уроків курсу -----');
    const query = 'SELECT * FROM lessons WHERE course_id = $1';
    const start = Date.now();
    const result = await pool.query(query, [courseId]);
    const end = Date.now();
    console.log(`Кількість уроків курсу: ${result.rowCount}, ${end - start}ms`);
    console.log('\n');
}

async function deleteRandomLessonAndHomework() {
    console.log("----- Видалення випадкового уроку та його домашнього завдання -----");
    const start = Date.now();

    try {
        const queryLesson = 'SELECT * FROM lessons WHERE homework_id IN (SELECT id FROM homeworks) ORDER BY RANDOM() LIMIT 1';
        const lessonResult = await pool.query(queryLesson);

        if (lessonResult.rows.length > 0) {
            const lessonId = lessonResult.rows[0].id;
            const homeworkId = lessonResult.rows[0].homework_id;

            const queryDeleteHomework = 'DELETE FROM homeworks WHERE id = $1';
            await pool.query(queryDeleteHomework, [homeworkId]);
            console.log(`Домашнє завдання для уроку ${lessonId} видалено`);

            const queryDeleteLesson = 'DELETE FROM lessons WHERE id = $1';
            await pool.query(queryDeleteLesson, [lessonId]);
            console.log(`Урок ${lessonId} видалено`);

        } else {
            console.log('Відсутні уроки, які посилаються на домашнє завдання');
        }
    } catch (error) {
        console.error('Помилка при видаленні уроку та домашнього завдання:', error);
    }

    const end = Date.now();
    console.log(`Сумарно ${end - start}ms`);
    console.log('\n');
}




async function deleteRandomCourseAndLessonsAndHomeworks() {
    console.log('----- Видалення випадкового курсу, його уроків та домашніх завдань -----');
    const start = Date.now();

    try {
        const queryLesson = 'SELECT * FROM lessons WHERE homework_id IN (SELECT id FROM homeworks) ORDER BY RANDOM() LIMIT 1';
        const lessonResult = await pool.query(queryLesson);

        if (lessonResult.rows.length > 0) {
            const lessonId = lessonResult.rows[0].id;
            const homeworkId = lessonResult.rows[0].homework_id;
            const courseId = lessonResult.rows[0].course_id;

            const queryDeleteHomework = 'DELETE FROM homeworks WHERE id = $1';
            await pool.query(queryDeleteHomework, [homeworkId]);
            console.log(`Домашнє завдання для уроку ${lessonId} видалено`);

            const queryDeleteLesson = 'DELETE FROM lessons WHERE id = $1';
            await pool.query(queryDeleteLesson, [lessonId]);
            console.log(`Урок ${lessonId} видалено`);

            const queryDeleteCourse = 'DELETE FROM courses WHERE id = $1';
            await pool.query(queryDeleteCourse, [courseId]);
            console.log(`Курс ${courseId} видалено`);

        } else {
            console.log('Відсутні уроки, які посилаються на домашнє завдання');
        }
    } catch (error) {
        console.error('Помилка при видаленні уроку та домашнього завдання:', error);
    }

    const end = Date.now();
    console.log(`Сумарно ${end - start}ms`);
    console.log('\n');
}


async function main() {
    await createUser('JohnDoe', 'student');
    await createUser('JaneDoe', 'teacher');
    await createHomework('Homework 1', 'Опис для домашнього завдання 1', '{attachment1.pdf, attachment2.docx}');
    await createCourse('Курс 1', 'Опис для курсу 1', null, 1);
    await createLesson('Урок 1', 1, 'Інструкції для уроку 1', 1, null, null);
    await deleteRandomLessonAndHomework();
    await deleteRandomCourseAndLessonsAndHomeworks();
    await getAllCourses();
    await getLessonsByCourse(randomCourseId);
    pool.end();
}

main().catch(err => console.error('Помилка:', err));
