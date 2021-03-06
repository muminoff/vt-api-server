var twilio = require('twilio');
var redis = require('redis');
var config = require('../utils/config');

var twilioClient = new twilio.RestClient(config.twilio_sid, config.twilio_token);
var redisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
});
redisClient.on('error', function(err) {
  logger.error('Cannot connect to Redis');
  process.exit(-1);
});

// redis authentication
redisClient.select(config.redis.db);
if(config.redis.auth)redisClient.auth(config.redis.auth);

var sendSMS = module.exports = function(phone_number, verification_code, logger, callback) {

  if(phone_number.startsWith('+') === false)phone_number='+' + phone_number;

  redisClient.get(phone_number, function(err, num) {
    if(!num) {

      logger.debug('Verification code not set');

      var textBody = 'Код подтверждения - ' +  verification_code.toString() + ' [DRIVERS.UZ]';

      twilioClient.sms.messages.create({
        to: phone_number,
        from: '+19143807070',
        body: textBody, 
      }, function(error, message) {
        if (!error) {
          logger.debug('Success! The SID for this SMS message is:');
          logger.debug(message.sid);
          logger.debug('Message sent on:');
          logger.debug(message.dateCreated);
          redisClient.set(phone_number, verification_code);
          redisClient.expire(phone_number, 60);
          callback({ status: 'ok', data: message });
        } else {
          logger.debug('Oops! There was an error.');
          callback({ status: 'fail', detail: error });
        }
      });

    } else {
      logger.debug('Verification code set to', verification_code);
      callback({ status: 'fail', detail: 'SMS API usage limit exceeded for phone number', phone_number });
    }
  });

};
