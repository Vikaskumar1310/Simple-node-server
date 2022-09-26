const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    },
}, {
    timestamps: true
});


userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        return { status : false, message: 'User not found, Please signup'}
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { status : false, message: 'Incorrect Password, Please login again'}
    }
    return { status : true, data: user}
}

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;