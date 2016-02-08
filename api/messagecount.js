var messageCountQuery = 'select count(id)::int8 as count from messages where topic_id=$1 and id >= $2';

var messageCount = module.exports = function(client, topic_id, from, logger, callback) {

  client.query(messageCountQuery, [topic_id, from], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ status: 'fail', detail: err });
    }

    return callback({ status: 'ok', count: result.rows[0].count });

  });

}
