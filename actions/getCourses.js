const mongoose = require('mongoose');
const { Course, User } = require('../entities');

mongoose.connect('mongodb://localhost:27017/online-school', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        const courses = await Course.find({});

        console.log('Courses:');
        for (const course of courses) {
            const teacher = await User.findById(course.teacher);

            console.log(`Title: ${course.title}`);
            console.log(`ID: ${course._id}`);
            console.log(`Teacher ID: ${course.teacher}`);
            console.log(`Teacher Name: ${teacher.username}`);
            console.log('---------------------------');
        }

        mongoose.connection.close();
    })
    .catch(error => console.error('Error fetching courses:', error));
