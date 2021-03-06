var createTopicQuery = 'INSERT INTO topics (title, body, parent_room, owner, attrs) VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, parent_room, archived, owner, attrs, (EXTRACT(epoch FROM created_at) * 1000)::int8 AS created_at, (SELECT id IN (SELECT topic_id FROM subscribers where user_id=$4)) AS subscribed';

var topicCreate = module.exports = function(client, title, body, parent_room, owner, attrs, logger, callback) {

  logger.debug('Owner inside api ->', owner);

  // topic create
  client.query(createTopicQuery, [title, body, parent_room, owner, attrs], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok', 'data': result.rows[0] });

  });

}
