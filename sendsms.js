var twilio = require('twilio');
var logger = require('./logger');
var config = require('./utils/config');
logger.level = config.log_level;

var client = new twilio.RestClient(config.twilio_sid, config.twilio_token);

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
