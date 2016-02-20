// main modules
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var pg = require('pg').native;

// funktionale programminghe stuffhe
// ay lob konkyurent kompyuting mazapaka
var __ = require('lazy.js');

// logger and config
var logger = require('./logger');
var config = require('./utils/config');

// turn on the radar to catch errors
// var raven = require('raven');
// var radar = new raven.Client('http://57e96643eab8444db0feadec48cec51b:4690fde3a81f40da84c4775581331da2@sentry.drivers.uz/3');
// radar.patchGlobal();

// set log level from config
logger.level = config.log_level;

// db pool size
pg.defaults.poolSize = config.postgresql.pool_size;

// variables
var pgUsername = config.postgresql.user;
var pgPassword = config.postgresql.pass;
var pgHostname = config.postgresql.host;
var pgPort = config.postgresql.port;
var pgDBName = config.postgresql.name;
var pgConnectionString = 
  'postgres://' + pgUsername + ':' + pgPassword + '@'+ pgHostname + ':' + pgPort.toString() + '/' + pgDBName;
var host = process.env.HOST || config.host;
var port = process.env.PORT || config.port;
var gcm_api_key = process.env.GCM_API_KEY || config.gcm_api_key;


// rest api stuff
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// api import
var signupUser = require('./api/signup');
var getToken = require('./api/gettoken');
var getUserInfo = require('./api/getuserinfo');
var checkUsername = require('./api/checkusername');
var checkPhonenumber = require('./api/checkphonenumber');
var updateUsername = require('./api/updateusername');
var updateProfile = require('./api/updateuserprofile');
var updateAvatar = require('./api/updateavatar');
var roomList = require('./api/roomlist');
var topicList = require('./api/topiclist');
var topicMembers = require('./api/topicmembers');
var topicCreate = require('./api/topiccreate');
var topicClose = require('./api/topicclose');
var topicOpen = require('./api/topicopen');
var topicDelete = require('./api/topicdelete');
var topicSubscribe = require('./api/topicsubscribe');
var topicUnsubscribe = require('./api/topicunsubscribe');
var messageHistory = require('./api/messagehistory');
var messageHistoryUp = require('./api/messagehistoryup');
var messageCount = require('./api/messagecount');
var messageDelete = require('./api/messagedelete');
var sendSMS = require('./api/sendsms');

// rest route
var router = express.Router();

// signup api
router.post('/signup', function(req, res) {

  var username = req.body.username;
  var phone_number = req.body.phone_number;
  var gcm_token = req.body.gcm_token;
  var device_type = req.body.device_type;

  logger.debug('username', username);
  logger.debug('phone_number', phone_number);
  logger.debug('gcm_token', gcm_token);
  logger.debug('device_type', device_type);

  if(!username) {
    return res.json({ status: 'fail', detail: 'username not given' });
  }

  if(!phone_number) {
    return res.json({ status: 'fail', detail: 'phone_number not given' });
  }

  if(!gcm_token) {
    return res.json({ status: 'fail', detail: 'gcm_token not given' });
  }

  if(!device_type) {
    return res.json({ status: 'fail', detail: 'device_type not given' });
  }

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    signupUser(client, username, phone_number, gcm_token, device_type, logger, function(resp) {
      logger.debug('Got response from API', resp);
      logger.info('User', username, 'signed up');
      logger.info('Resp', resp);
      done();
      return res.json(resp);
    });
  
  });

});

// get token api
router.post('/get_token', function(req, res) {

  var phone_number = req.body.phone_number;
  var gcm_token = req.body.gcm_token;

  logger.debug('phone_number', phone_number);
  logger.debug('gcm_token', gcm_token);

  if(!phone_number) {
    return res.json({ status: 'fail', detail: 'phone_number not given' });
  }


  pg.connect(pgConnectionString, function(err, client, done) {

    logger.debug('headers --->', req.headers);

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.debug('User', ip, 'asks to get token for', phone_number);

    getToken(client, phone_number, gcm_token, logger, function(resp) {
      done();
      logger.debug('Got response from API', resp);
      return res.json(resp);
    });
  
  });

});

// get user info api
router.post('/user_info', function(req, res) {

  var user_id = req.body.user_id;

  logger.debug('user_id', user_id);

  if(!user_id) {
    return res.json({ status: 'fail', detail: 'user_id not given' });
  }


  pg.connect(pgConnectionString, function(err, client, done) {

    logger.debug('headers --->', req.headers);

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.debug('User', ip, 'asks to get user info for', user_id);

    getUserInfo(client, user_id, logger, function(resp) {
      done();
      logger.debug('Got response from API', resp);
      return res.json(resp);
    });
  
  });

});

// check username api
router.post('/check_username', function(req, res) {

  var username = req.body.username;

  logger.debug('username', username);

  if(!username) {
    return res.json({ status: 'fail', detail: 'username not given' });
  }


  pg.connect(pgConnectionString, function(err, client, done) {

    logger.debug('headers --->', req.headers);

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.debug('User', ip, 'checks username availability for', username);

    checkUsername(client, username, logger, function(resp) {
      done();
      logger.debug('Got response from API', resp);
      logger.info('Username', username, (resp.exists) ? ('busy'): ('available'));
      return res.json(resp);
    });
  
  });

});

// check number api
router.post('/check_phone_number', function(req, res) {

  var phone_number = req.body.phone_number;

  logger.debug('phone_number', phone_number, typeof(phone_number), phone_number.length);

  if(!phone_number) {
    return res.json({ status: 'fail', detail: 'phone_number not given' });
  }


  pg.connect(pgConnectionString, function(err, client, done) {

    logger.debug('headers --->', req.headers);

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.debug('User', ip, 'checks phone_number availability for', phone_number);

    checkPhonenumber(client, phone_number, logger, function(resp) {
      done();
      logger.debug('Got response from API', resp);
      logger.info('Phone number', phone_number, (resp.exists) ? ('busy'): ('available'));
      return res.json(resp);
    });
  
  });

});

// topic members api
// TODO: check token before proceeding !!!
router.get('/rooms/:room_id/topics/:topic_id/members', function(req, res) {

  var room_id = req.params.room_id;
  var topic_id = req.params.topic_id;

  logger.debug('topic_id', topic_id);

  if(!topic_id) {
    return res.json({ status: 'fail', detail: 'topic_id not given' });
  }

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    topicMembers(client, topic_id, logger, function(resp) {
      logger.debug('Sending data ' + JSON.stringify(resp));
      done();
      return res.json(resp);
    });

  });
});

// room list api
router.get('/rooms', function(req, res) {

  logger.debug('headers --->', req.headers);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.debug('User', ip, 'asks for room list');

    roomList(client, logger, function(roomlist){
      logger.debug('Sending data ' + JSON.stringify(roomlist));
      done();
      return res.json({ status: 'ok', data: roomlist });
    });

  });
});

// topic list api
// TODO: check token before proceeding !!!
router.post('/rooms/:room_id/topics', function(req, res) {

  var room_id = req.params.room_id;
  var user_id = req.body.user_id;

  logger.debug('User', user_id, 'asks for topic list of room', room_id);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    // send topic list
    topicList(client, room_id, user_id, logger, function(topiclist){
      logger.debug('Sending data ' + JSON.stringify(topiclist));
      done();
      return res.json({ status: 'ok', data: topiclist });
    });

  });
});

// topic create api
// TODO: check token before proceeding !!!
router.post('/rooms/:room_id', function(req, res) {

  var owner = req.body.user_id;
  var title = req.body.title;
  var body = req.body.body;
  var parent_room = req.params.room_id;
  var attrs = req.body.attrs;

  logger.debug('User', owner, 'asks to create topic for room', parent_room);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    // send topic create result to user
    topicCreate(client, title, body, parent_room, owner, attrs, logger, function(resp){

      logger.debug('Sending ->', resp);
      done();
      return res.json(resp);

    });

  });
});

// message history api
// TODO: check token before proceeding !!!
router.post('/rooms/:room_id/topics/:topic_id/history', function(req, res) {

  var user_id = req.body.user_id;
  var room_id = req.params.room_id;
  var topic_id = req.params.topic_id;
  var from = req.body.from;
  var size = req.body.size;

  logger.debug('User', user_id, 'asks for message history for topic', topic_id, 'in room', room_id);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    messageHistory(client, topic_id, from, size, logger, function(resp){

      logger.debug('Sending ->', resp);
      done();
      return res.json(resp);

    });

  });
});

// message history api
// TODO: check token before proceeding !!!
router.post('/rooms/:room_id/topics/:topic_id/history_up', function(req, res) {

  var user_id = req.body.user_id;
  var room_id = req.params.room_id;
  var topic_id = req.params.topic_id;
  var from = req.body.from;
  var size = req.body.size;

  logger.debug('User', user_id, 'asks for message history for topic', topic_id, 'in room', room_id);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    messageHistoryUp(client, topic_id, from, size, logger, function(resp){

      logger.debug('Sending ->', resp);
      done();
      return res.json(resp);

    });

  });
});


// new message count api
// TODO: check token before proceeding !!!
router.post('/rooms/:room_id/topics/:topic_id/count', function(req, res) {

  var user_id = req.body.user_id;
  var room_id = req.params.room_id;
  var topic_id = req.params.topic_id;
  var from = req.body.from;

  logger.debug('User', user_id, 'asks for message count for topic', topic_id, 'in room', room_id);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    messageCount(client, topic_id, from, logger, function(resp){

      logger.debug('Sending ->', resp);
      done();
      return res.json(resp);

    });

  });
});

// message delete api
// TODO: check token before proceeding !!!
router.post('/messages/:message_id/delete', function(req, res) {

  var message_id = req.params.message_id;
  var user_id = req.body.user_id;

  logger.debug('User', user_id, 'asks to delete message', message_id);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    messageDelete(client, message_id, user_id, logger, function(resp){

      logger.debug('Sending ->', resp);
      done();
      return res.json(resp);

    });

  });
});

// topic subscribe api
// TODO: check token before proceeding !!!
router.post('/rooms/:room_id/topics/:topic_id/subscribe', function(req, res) {

  var user_id = req.body.user_id;
  var room_id = req.params.room_id;
  var topic_id = req.params.topic_id;

  logger.debug('User', user_id, 'asks to subscribe for topic', topic_id, 'in room', room_id);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    // send topic create result to user
    topicSubscribe(client, user_id, topic_id, logger, function(resp){

      logger.debug('Sending ->', resp);
      done();
      return res.status(200).json(resp);

    });

  });
});

// topic unsubscribe api
// TODO: check token before proceeding !!!
router.post('/rooms/:room_id/topics/:topic_id/unsubscribe', function(req, res) {

  var user_id = req.body.user_id;
  var room_id = req.params.room_id;
  var topic_id = req.params.topic_id;

  logger.debug('User', user_id, 'asks to unsubscribe from topic', topic_id, 'in room', room_id);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    // send topic create result to user
    topicUnsubscribe(client, user_id, topic_id, logger, function(resp){

      logger.debug('Sending ->', resp);
      done();
      return res.json(resp);

    });

  });
});

// topic close api
// TODO: check token before proceeding !!!
router.post('/rooms/:room_id/topics/:topic_id/close', function(req, res) {

  var user_id = req.body.user_id;
  var room_id = req.params.room_id;
  var topic_id = req.params.topic_id;

  logger.debug('User', user_id, 'asks to close topic', topic_id, 'in room', room_id);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    topicClose(client, user_id, topic_id, logger, function(resp){

      logger.debug('Sending ->', resp);
      done();
      return res.status(200).json(resp);

    });

  });
});

// topic open api
// TODO: check token before proceeding !!!
router.post('/rooms/:room_id/topics/:topic_id/open', function(req, res) {

  var user_id = req.body.user_id;
  var room_id = req.params.room_id;
  var topic_id = req.params.topic_id;

  logger.debug('User', user_id, 'asks to open topic', topic_id, 'in room', room_id);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    topicOpen(client, user_id, topic_id, logger, function(resp){

      logger.debug('Sending ->', resp);
      done();
      return res.status(200).json(resp);

    });

  });
});

// topic delete api
// TODO: check token before proceeding !!!
router.post('/rooms/:room_id/topics/:topic_id/delete', function(req, res) {

  var user_id = req.body.user_id;
  var room_id = req.params.room_id;
  var topic_id = req.params.topic_id;

  logger.debug('User', user_id, 'asks to delete topic', topic_id, 'in room', room_id);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    topicDelete(client, user_id, topic_id, logger, function(resp){

      logger.debug('Sending ->', resp);
      done();
      return res.status(200).json(resp);

    });

  });
});

// update username api
// TODO: check token before proceeding !!!
router.post('/update_username', function(req, res) {

  var user_id = req.body.user_id;
  var username = req.body.username;

  logger.debug('User', user_id, 'asks to update username for', username);

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    updateUsername(client, user_id, username, logger, function(resp){

      logger.debug('Sending ->', resp);
      done();
      return res.status(200).json(resp);

    });

  });
});

// update profile api
// TODO: check token before proceeding !!!
router.post('/update_avatar', function(req, res) {

  var user_id = req.body.user_id;
  var avatar_url = req.body.avatar_url;

  logger.debug('User', user_id, 'asks to update avatar');

  pg.connect(pgConnectionString, function(err, client, done) {

    if(err) {
      done();
      logger.error(err);
      return res.status(500).json({ status: 'fail', data: err });
    }

    updateAvatar(client, user_id, avatar_url, logger, function(resp){

      logger.debug('Sending ->', resp);
      done();
      return res.status(200).json(resp);

    });

  });
});

// send sms api
// TODO: check token before proceeding !!!
router.post('/send_sms', function(req, res) {

  var phone_number = req.body.phone_number;
  var verification_code = req.body.verification_code;

  logger.debug('Phone', phone_number, 'asks to send sms with verification code', verification_code);

  sendSMS(phone_number, verification_code, logger, function(resp) {
    logger.debug('Got response from SMS API', resp);
    return res.status(200).json(resp);
  });

});

// status page
// TODO: check token before proceeding !!!
router.get('/status', function(req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.debug('User', ip, 'asks for server status');
    return res.json({ status: 'live' });
});

app.use('/', router);

server.listen(port, host, function () {
  logger.info('Server listening at %s:%d', host, port);
});
