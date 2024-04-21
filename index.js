const mongoose = require('mongoose');
const { User, Course, Lesson, Homework } = require('./entities');

mongoose.connect('mongodb://localhost:27017/online-school', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        const teacher = new User({
            username: 'teacher1',
            role: 'teacher',
        });

        await teacher.save();

        const student = new User({
            username: 'student1',
            role: 'student',
            courses: [],
            completedHws: [],
        });

        await student.save();

        const startDateCourse1 = new Date('2024-04-21');
        const startDateCourse2 = new Date('2024-04-17');

        const course1 = new Course({
            title: 'Course 1',
            description: 'Description of course 1',
            teacher: teacher._id,
            lessonCount: 3,
        });

        const course2 = new Course({
            title: 'Course 2',
            description: 'Description of course 2',
            teacher: teacher._id,
            lessonCount: 3,
        });

        await Promise.all([course1.save(), course2.save()]);

        const lessonsCourse1 = [];
        for (let i = 1; i <= 3; i++) {
            const lesson = new Lesson({
                title: `Lesson ${i}`,
                number: i,
                instructions: `Instructions for lesson ${i}`,
                showAtDay: i,
                course: course1._id,
            });

            const homework = new Homework({
                title: `Homework for Lesson ${i}`,
                description: `Description of homework for Lesson ${i}`,
                attachments: [`attachment${i}.pdf`],
            });

            lesson.homework = homework._id;
            lessonsCourse1.push(lesson);
            await Promise.all([lesson.save(), homework.save()]);
        }
        course1.lessons = lessonsCourse1;
        await course1.save();

        const lessonsCourse2 = [];
        for (let i = 1; i <= 3; i++) {
            const lesson = new Lesson({
                title: `Lesson ${i}`,
                number: i,
                instructions: `Instructions for lesson ${i}`,
                showAtDay: i,
                course: course2._id,
            });

            const homework = new Homework({
                title: `Homework for Lesson ${i}`,
                description: `Description of homework for Lesson ${i}`,
                attachments: [`attachment${i}.pdf`],
            });

            lesson.homework = homework._id;
            lessonsCourse2.push(lesson);
            await Promise.all([lesson.save(), homework.save()]);
        }
        course2.lessons = lessonsCourse2;
        await course2.save();

        student.courses.push({ course: course1._id, startDate: startDateCourse1 });
        student.courses.push({ course: course2._id, startDate: startDateCourse2 });
        student.completedHws.push(course1.lessons[0].homework);
        await student.save();

        console.log('Test data created successfully');
        mongoose.connection.close();
    })
    .catch(error => console.error('Error creating test data:', error));
