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
userSchema.methods.comparepassword = async function (password) {
    return bcrypt.compare(password, this.password);
};


// find by token
userSchema.statics.findByToken = async function (token) {
    const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, config.SECRET, (err, decode) => {
            if (err) reject(err);
            else resolve(decode);
        });
    });
    return this.findOne({ _id: decoded, token });
};


const Users = mongoose.model("Users", userSchema);  
export default Users;