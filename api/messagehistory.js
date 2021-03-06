var messageHistoryQuery = "select id, stamp_id, topic_id, json_build_object('id', owner, 'username', (select username from users where id=owner)::text) as owner, reply_to, body, attrs, has_media, (extract(epoch from sent_at) * 1000)::int8 as sent_at from messages where topic_id=$1 and id >= $2 order by id asc limit $3";

var messageHistory = module.exports = function(client, topic_id, from, size, logger, callback) {

  client.query(messageHistoryQuery, [topic_id, from, size], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok', 'data': result.rows });

  });

}
