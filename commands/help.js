module.exports = {
  handle : function(msg, bot) {
    bot.sendMessage(msg.chat.id, "/help - this message \n/counter - requests count");
  }
};
