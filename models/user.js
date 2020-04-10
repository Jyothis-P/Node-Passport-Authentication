var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    resetPasswordToken : {type: String},
    resetPasswordExpires : {type: Date},

});

userSchema.plugin(passportLocalMongoose);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);