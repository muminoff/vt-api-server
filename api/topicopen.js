var topicOpenQuery = "UPDATE topics SET closed=false WHERE (owner=$1 AND id=$2) OR (($1 IN (SELECT id FROM users WHERE roles ->> 'admin' = 'true')) AND id=$2)";

var topicOpen = module.exports = function(client, user_id, topic_id, logger, callback) {

  logger.debug('User ID inside api ->', user_id);

  // topic create
  client.query(topicOpenQuery, [user_id, topic_id], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok' });

  });

}
