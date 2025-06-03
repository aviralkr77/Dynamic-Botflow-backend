import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 
import dbconfig from '../../config/dbconfig.js';


const config = dbconfig.get(process.env.NODE_ENV);
const salt = 10;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(salt, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                console.log('here in model')
                user.password = hash;
                next();
            })

        })
    }
    else {
        next();
    }
});
userSchema.methods.comparepassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(next);
        cb(null, isMatch);
    });
}


// find by token
userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    jwt.verify(token, config.SECRET, function (err, decode) {

        user.findOne({ "_id": decode, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        })
    })
};


const Users = mongoose.model("Users", userSchema);  
export default Users;