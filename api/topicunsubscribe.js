var topicUnsubscribeQuery = "DELETE FROM subscribers WHERE user_id=$1 AND topic_id=$2";

var topicUnsubscribe = module.exports = function(client, user_id, topic_id, logger, callback) {

  // topic create
  client.query(topicUnsubscribeQuery, [user_id, topic_id], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok' });

  });

}
