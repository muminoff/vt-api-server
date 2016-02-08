var topicCloseQuery = "UPDATE topics SET closed=true WHERE owner=$1 AND id=$2 OR $2 IN (SELECT id FROM users WHERE roles ->> 'admin' = 'true')";

var topicClose = module.exports = function(client, user_id, topic_id, logger, callback) {

  logger.debug('User ID inside api ->', user_id);

  // topic create
  client.query(topicCloseQuery, [user_id, topic_id], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok' });

  });

}