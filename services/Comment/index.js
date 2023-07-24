require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');
const redis = require('redis');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let CommentModel;
let ScoreModel;

/** mongo Connection */
async function connectionMongo() {
    await mongoose.connect(process.env.commentMongoDbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('mongo Connect')
    });
    require("./model/CommentModel")
    require("./model/ScoreModel")
    CommentModel = mongoose.model("Comment")
    ScoreModel = mongoose.model("Score")
}

// load initial modules
async function initialLoad() {
    await connectionMongo();
}

initialLoad();

app.get("/", (req, res) => {
    res.send('Main Page For Comment Server')
});

app.get("/all", (req, res) => {
    CommentModel.find().then((comments) => {
        return res.send(comments);
    }).catch((err) => {
        res.statusCode = 404;
        return res.send('Not Found')
        if (err) {
            throw err
        }
    });
});

app.post('/', (req, res) => {
    const newComment = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "productId": req.body.productId,
        "productType": req.body.productType,
        "comment": req.body.comment,
        "isPublic": req.body.isPublic
    }
    const newScore = {
        "productId": req.body.productId,
        "productType": req.body.productType,
        "price": req.body.price,
        "service": req.body.service,
        "room": req.body.room,
        "food": req.body.food,
        "avg": req.body.avg,
        "commentId": 0,
        "isPublic": req.body.isPublic
    }
    const Comment = new CommentModel(newComment);
    Comment.save().then((process) => {

        newScore.commentId = process._id;
        const Score = new ScoreModel(newScore);

        Score.save().then((r) => {
            res.statusCode = 201
            res.send({"message": "data created", "data": {"comment": newComment, "score": newScore}});
        }).catch((err) => {
            res.statusCode = 400;
            res.send('Bad Request ');
        });
    }).catch((err) => {
        res.statusCode = 400;
        res.send('Bad Request ');
    })
})

app.put('/user/:id', (req, res) => {
    CommentModel.findOne({"_id": req.params.id}).then((err, comment) => {
        if (err) {
            console.log('error var laa ')
        }
        if (comment) {
            res.json(comment)
        } else {
            res.sendStatus(404);
        }
    })
    return true;
})

app.get('/product/:id', async (req, res) => {
    let commentData;
    console.log('asdaa', req.params)
    const bbb = await CommentModel.find({"productId": req.params.id}).exec();
   // const aaa = await ScoreModel.aggregate([{$match: {"productId": req.params.id}}, { $unwind: "$Comments" },
    //    {$group: {_id: "$_id", average: {$avg: "$Comments.food"}}}]).exec();
    /*const aaa = await ScoreModel.find({"productId": req.params.id}).exec();*/
    const aaa = await ScoreModel.aggregate([
        {$match: {"productId":  req.params.id}},
        { $group: {
                "_id": "$_id",
                "foodAvg": {$avg: 'food'},  //$first accumulator
                "priceAvg": {$avg: 'price'},  //$sum accumulator
                "roomAvg": { $avg: "room" }  //$sum accumulator
            }}
    ]).exec();
    console.log("asdas", aaa);
    res.send({"comment": bbb,"score":aaa})
});

app.listen(process.env.servicePort, () => {
    console.log('aaaaaaaaa');
});