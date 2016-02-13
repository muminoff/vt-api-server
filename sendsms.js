var twilio = require('twilio');
var logger = require('./logger');
var config = require('./utils/config');
logger.level = config.log_level;

var client = new twilio.RestClient(config.twilio_sid, config.twilio_token);

var numbers = [
   '+998911623285',
   '+998909684858',
   '+998909765686',
   '+998903271110',
   '+998935572115',
   '+998903208735',
   '+998903739966',
   '+998909210740',
];

numbers.forEach(function(number) {
  logger.debug(number);
  client.sms.messages.create({
      to:'+998911623285',
      from:'+19143807070',
      body:'Tezda Telegramga kiring [DRIVERS.UZ]'
  }, function(error, message) {
      if (!error) {
          logger.debug('Success! The SID for this SMS message is:');
          logger.debug(message.sid);
   
          logger.debug('Message sent on:');
          logger.debug(message.dateCreated);
      } else {
          logger.debug('Oops! There was an error.');
      }
  });;
});

