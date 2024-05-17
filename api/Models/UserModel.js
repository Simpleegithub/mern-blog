const mongoose =require('mongoose');

const UserSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    }
},{timestamps:true})

const User=mongoose.Model('User',UserSchema);

export default User;