var messageHistoryQuery = "select id, stamp_id, topic_id, json_build_object('id', owner, 'username', (select username from users where id=owner)::text) as owner, reply_to, body, attrs, has_media, (extract(epoch from sent_at) * 1000)::int8 as sent_at from messages where $1 in (select user_id from subscribers where topic_id=$2) and topic_id=$2 and id >= $3 order by id asc limit $4";

var messageHistory = module.exports = function(client, user_id, topic_id, from, size, logger, callback) {

  logger.debug('User ID inside api ->', user_id);

  // topic create
  client.query(messageHistoryQuery, [user_id, topic_id, from, size], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok', 'data': result.rows });

  });

}
