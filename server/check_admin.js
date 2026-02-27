require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcampus', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    const admin = await User.findOne({ email: 'admin@college.edu' });
    if (admin) {
        console.log('Admin user found:', admin.email);
        console.log('Password hash:', admin.password);
    } else {
        console.log('Admin user not found. Checking all users:');
        const users = await User.find({}, 'email name role');
        console.log(users);
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
