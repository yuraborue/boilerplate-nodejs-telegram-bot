
function counter() {
  var count = 0;
  this.handle = function(msg, bot) {
    bot.sendMessage(msg.chat.id, count++);
  };
}

module.exports = counter;
