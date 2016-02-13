var getTopicListQuery = "SELECT topics.id, topics.title, topics.body, topics.parent_room, topics.closed, (SELECT topics.id IN (SELECT subscribers.topic_id FROM subscribers WHERE subscribers.user_id=$2)) AS subscribed, json_build_object('id', topics.owner, 'username', (SELECT users.username FROM users WHERE users.id=owner)) AS owner, topics.attrs, (EXTRACT(epoch FROM topics.created_at) * 1000)::int8 AS created_at, (EXTRACT(epoch FROM topics.closed_at) * 1000)::int8 AS closed_at, (SELECT left(messages.body, 50) FROM messages WHERE (messages.attrs ->> 'robot_message') IS NULL AND messages.topic_id=topics.id LIMIT 1) AS last_message FROM topics WHERE parent_room=$1 AND archived=false";

var topicList = module.exports = function(client, room_id, user_id, logger, callback) {

  client.query(getTopicListQuery, [room_id, user_id], function(err, result) {

    if(err) {
      logger.error(err);
    }

    return callback(result.rows);
  });

}
