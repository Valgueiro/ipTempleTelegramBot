const TOKEN = '661569390:AAFlEN-kwORqumIGg16KwiFab7C4n5bwTKY';
//const ENVIRONMENT = 'developer'
const defaultPass = "123456"
const express = require('express')
const Telegraf = require('telegraf')
const bodyParser = require('body-parser')

const bot = new Telegraf(TOKEN)
const server = express();

var ids = [];

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))

bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.hears(/\/register/, (ctx) =>register(ctx))


function register(ctx){
    const chatId = ctx.from.id;
    console.log(ctx.message.text);
    const resp = ctx.message.text.split(" ")[1];
    
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
    
    bot.telegram.sendMessage(chatId, msg);
}

const PORT = process.env.PORT || 3000;

if (process.env.ENVIRONMENT === "production") {
    bot.telegram.setWebhook(`${MORI_BOT_PROD_URL}/bot${TELEGRAM_API_KEY}`);
    
    server.use(bot.webhookCallback(`/bot${TELEGRAM_API_KEY}`));

    server.get("/", (req, res) => {
        res.send("Hello World!");
    });
    server.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
} else {
    console.log("polling");
    bot.startPolling();

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }))
}



// Route that receives a POST request to /sms
server.post('/notify', function (req, res) {
    var msg = req.body.msg;
     if(msg != undefined){
        ids.forEach(i => {
            bot.telegram.sendMessage(i,"New question: "  + msg);
        });
    }
    
    res.send("Received");
})

// Tell our server to listen on port of heroku
server.listen(process.env.PORT || 3000, function (err) {
    if (err) {
        throw err
    }

    console.log('Server started on port 3000')
})
