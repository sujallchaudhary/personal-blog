const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    excerpt:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    category:{
        type:String,
    },
    tags:{
        type:Array
    },
    thumbnail:{
        type:String
    },
    aiDiscussionAudio:{
        type:String
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },


});
module.exports = mongoose.model('BlogPost', blogPostSchema);