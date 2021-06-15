const mongoose = require('mongoose');

//build user schema from
const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        min: 3, 
        max: 20, 
        unique: true
    }, 
    email: {
        type: String,
        required: true,
        max: 20,
        unique: true
    }, 
    password: {
        type: String, 
        required: true,
        min: 5, 
    },
    profilePicture: {
        type: String,
        default: ""
    }, 
    coverPicture: {
        type: String, 
        default: ""
    }, 
    followers: {
        //will be composed of an array of user Ids
        type: Array, 
        default: []
    }, 
    following: {
        type: Array,
        default: []
    }, 
    isAdmin: {
        type: Boolean,
        default: false
    }, 
    desc: {
        type: String, 
        max: 50
    }, 
    city: {
        type:String, 
        max: 50
    }, 
    from: {
        type: String,
        max: 50
    }, 
    relationship: {
        type: Number,
        enum: [1, 2, 3] //each value will equte to singe, relationship, married 
    }
},
{timestamps: true}
); 

module.exports = mongoose.model('User', userSchema); 

