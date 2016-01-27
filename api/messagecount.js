var messageCountQuery = 'select count(id)::int8 as count from messages where $1 in (select user_id from subscribers where topic_id=$2) and topic_id=$2 and id >= $3';

var messageCount = module.exports = function(client, user_id, topic_id, from, logger, callback) {

  logger.debug('User ID inside api ->', user_id);

  // topic create
  client.query(messageCountQuery, [user_id, topic_id, from], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ status: 'fail', detail: err });
    }

    return callback({ status: 'ok', count: result.rows[0].count });

  });

}
