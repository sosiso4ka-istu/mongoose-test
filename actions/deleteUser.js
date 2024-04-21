const mongoose = require('mongoose');
const prompt = require('prompt');
const { User, Course } = require('../entities');

mongoose.connect('mongodb://localhost:27017/online-school', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        const users = await User.find({});

        console.log('Users:');
        users.forEach(user => {
            console.log(`ID: ${user._id}, Username: ${user.username}, Role: ${user.role}`);
        });

        prompt.start();

        prompt.get(['userId'], async function(err, result) {
            if (err) { return onErr(err); }

            const userId = result.userId;

            const userToDelete = await User.findById(userId);

            if (!userToDelete) {
                console.error('User not found!');
                mongoose.connection.close();
                return;
            }

            console.log(`Are you sure you want to delete user "${userToDelete.username}"? (yes/no)`);

            prompt.get(['confirmation'], async function(err, result) {
                if (err) { return onErr(err); }

                const confirmation = result.confirmation.toLowerCase();

                if (confirmation === 'yes' || confirmation === 'y') {
                    try {
                        await Course.updateMany({ 'teacher': userId }, { $unset: { 'teacher': 1 } });
                        await Course.updateMany({ 'students.user': userId }, { $pull: { 'students': { 'user': userId } } });

                        // Удаление пользователя из базы данных
                        await User.deleteOne({ _id: userId });
                        console.log('User deleted successfully!');
                    } catch (error) {
                        console.error('Error deleting user:', error);
                    }
                } else {
                    console.log('Deletion canceled.');
                }

                mongoose.connection.close();
            });
        });
    })
    .catch(error => console.error('Error connecting to MongoDB:', error));

function onErr(err) {
    console.error(err);
    return 1;
}
