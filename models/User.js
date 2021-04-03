const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Geçersiz Email Adresi!'],
        required: 'Email adresi boş bırakılamaz!'
    },
    name: {
        type: String,
        required: 'İsim kısmı boş bırakılamaz!',
        trim: true
    },
    resetPaswordToken: String,
    resetPasswordExpires: Date,
    hearts: [
        { type: mongoose.Schema.ObjectId, ref: 'Store' }
    ],
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBusiness: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

userSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email'});
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);