var topicSubscribeQuery = "INSERT INTO subscribers (topic_id, user_id) SELECT $2, $1 WHERE NOT EXISTS (SELECT user_id FROM subscribers WHERE user_id=$1 AND topic_id=$2)";

var topicSubscribe = module.exports = function(client, user_id, topic_id, logger, callback) {

  logger.debug('User ID inside api ->', user_id);

  // topic create
  client.query(topicSubscribeQuery, [user_id, topic_id], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok' });

  });

}
