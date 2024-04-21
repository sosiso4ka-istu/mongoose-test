const mongoose = require('mongoose');
const prompt = require('prompt');
const { User } = require('../entities');

const validRoles = ['student', 'teacher', 'admin'];

function isValidRole(role) {
    return validRoles.includes(role);
}

mongoose.connect('mongodb://localhost:27017/online-school', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        prompt.start();

        function promptUser() {
            prompt.get(['username', 'role'], async function(err, result) {
                if (err) { return onErr(err); }

                if (!isValidRole(result.role)) {
                    console.error('Invalid role! Please choose one of the following roles: ' + validRoles);
                    promptUser();
                    return;
                }

                const newUser = new User({
                    username: result.username,
                    role: result.role
                });

                try {
                    await newUser.save();
                    console.log('New user created successfully!');
                } catch (error) {
                    console.error('Error creating user:', error);
                } finally {
                    await mongoose.connection.close();
                }
            });
        }

        promptUser();
    })
    .catch(error => console.error('Error connecting to MongoDB:', error));

function onErr(err) {
    console.error(err);
    return 1;
}
