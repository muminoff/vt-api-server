var messageCountQuery = "SELECT COUNT(id)::int8 AS count FROM messages WHERE topic_id=$1 AND id >= $2 AND (messages.attrs ->> 'robot_message') IS NULL";

var messageCount = module.exports = function(client, topic_id, from, logger, callback) {

  client.query(messageCountQuery, [topic_id, from], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ status: 'fail', detail: err });
    }

    return callback({ status: 'ok', count: result.rows[0].count });

  });

}
