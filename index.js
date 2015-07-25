var TelegramBot = require('node-telegram-bot-api'),
    config = require('./config'),
    token = config.get('telegram:token'),
    commands = {},
    fs = require('fs');

fs.readdirSync(__dirname + '/commands').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    commands[name] = require('./commands/' + file);
  }
});

console.log('Start with ' + Object.keys(commands).length + ' commands');

var bot = new TelegramBot(token, { polling: true });
var chats = {};

bot.on('message', function (msg) {
  var chatId = msg.chat.id,
      command,
      request;
  console.log(JSON.stringify(msg));
  if (!chats[chatId])
    chats[chatId] = {};

  if ((!msg.text) || (msg.text[0] != '/'))
    return bot.sendMessage(chatId, "Command not found");

  request = msg.text.replace(/ +(?= )/g,'').trim().split(' ');
  command = request.shift().substring(1);

  if (!commands[command])
    return bot.sendMessage(chatId, "Command not found");

  if ((!chats[chatId][command]))
  {
    console.log(typeof commands[command]);
    if (typeof commands[command] == 'function')
      chats[chatId][command] = new commands[command]();
    else
      chats[chatId][command] = commands[command];
  }

  request.unshift(msg, bot);

  chats[chatId][command].handle.apply(chats[chatId][command], request);
});
