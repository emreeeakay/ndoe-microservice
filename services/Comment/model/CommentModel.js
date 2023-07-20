const mongoose = require("mongoose");

mongoose.model('Comment', {
    firstName : {
        type: String,
        require: true
    },
    lastName :{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
    },
    productId : {
        type: Number,
        require: true,
    },
    productType : {
        type: String,
        require: true
    },
    comment:{
        type:String,
        require: true,
    },
    isPublic:{
        type:Boolean,
        default: false
    },
    createdAt : {
        type: Date,
        require: true,
        default:Date.now
    }
});