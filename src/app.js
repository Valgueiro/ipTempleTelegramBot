const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const bodyParser = require('body-parser')
const token = '661569390:AAFlEN-kwORqumIGg16KwiFab7C4n5bwTKY';
const bot = new TelegramBot(token, { polling: true });

// Create a new instance of express
const app = express()

const defaultPass = "123456"

var ids = []

bot.onText(/\/register/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match.input.split(" ")[1];
    var msg;
    if(ids.indexOf(chatId) == -1){
        if (resp == defaultPass) {
            ids.push(chatId);
            msg = "Registered!";
        }else{
            msg = "Incorrect Password.";
        }
    }else{
        msg = "You're already registered!";
    }
    
    bot.sendMessage(chatId, msg);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// Route that receives a POST request to /sms
app.post('/notify', function (req, res) {
    var msg = req.body.msg;
     if(msg != undefined){
        ids.forEach(i => {
            bot.sendMessage(i,"New question: "  + msg);
        });
    }
    
    res.send("Received");
})

// Tell our app to listen on port of heroku
app.listen(process.env.PORT || 3000, function (err) {
    if (err) {
        throw err
    }

    console.log('Server started on port 3000')
})
