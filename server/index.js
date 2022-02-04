const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config()
const token = 'YOUR_TELEGRAM_BOT_TOKEN' || process.env.telegram_token;
const bot = new TelegramBot(token, {polling: true});
const chatId = null;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/initial', (req, res) => {
  const time_interval = process.env.time_interval
  const specified_uesr_token_id = process.env.specified_uesr_token_id
  const account_address = process.env.account_address
  bot.onText(/\/echo (.+)/, (msg, match) => {
    chatId = msg.chat.id;
    bot.sendMessage(chatId, "OpenSea monitoring...");
  });
  res.send({time_interval: time_interval, user_token_id: specified_uesr_token_id, account_address: account_address})
})

app.post('/api/send', (req, res) => {
  
  req.body.map((ele, index) => {
    let msg = ''
    msg += ('User_Name: ' + ele.user_name)
    msg += ('Event_Type: ' + ele.event_type)
    msg += ('NFT_Name: ' + ele.nft_name)
    msg += ('Price: ' + ele.price)
    msg += ('Url: ' + ele.url)
    bot.sendMessage(chatId, msg);
  });
    
})

app.listen(3001, () =>{
  console.log('Express server is running on localhost:3001')
  console.log(process.env.telegram_token)
});
