import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profilePic: {type: String, default: ""},
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    token: {type: String, default: null},
    isverified: {type: Boolean, default: false},
    isLoggedIn: {type: Boolean, default: false},
    otp: {type: String, default: null},
    otpExpiry: {type: Date, default: null},
    address: {
        street: {type: String},
        city: {type: String},
        state: {type: String},
        country: {type: String},
        pincode: {type: String},
    },
    phoneNo: {type: String},
    
}, {timestamps: true} );

const User = mongoose.model("User", userSchema);

export default User;
