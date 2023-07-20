const mongoose = require("mongoose");

mongoose.model('Score', {
    productId : {
        type: Number,
        require: true,
    },
    productType : {
        type: String,
        require: true
    },
    price:{
        type:Number,
        require: true,
    },
    service:{
        type:Number,
        require: true,
    },
    room:{
        type:Number,
        require: true,
    },
    food:{
        type:Number,
        require: true,
    },
    avg:{
        type:Number,
        require: true,
    },
    commentId:{
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