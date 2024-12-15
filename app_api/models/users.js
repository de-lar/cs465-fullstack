const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
});

// Set password by creating a salt and hash
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Validate the provided password
userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

// Generate a JWT for the user
userSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            exp: parseInt(expiry.getTime() / 1000, 10)
        },
        process.env.JWT_SECRET // Make sure JWT_SECRET is set in your environment
    );
};

// Register the model with mongoose
const User = mongoose.model('users', userSchema);

module.exports = User;
