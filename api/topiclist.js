var getTopicListQuery = "SELECT id, title, body, parent_room, closed, json_build_object('id', owner, 'username', (SELECT username FROM users WHERE id=owner)) as owner, attrs, (EXTRACT(epoch FROM created_at) * 1000)::int8 as created_at, (EXTRACT(epoch FROM closed_at) * 1000)::int8 as closed_at FROM topics WHERE parent_room=$1 AND archived=false;";

var topicList = module.exports = function(client, room_id, logger, callback) {

  client.query(getTopicListQuery, [room_id], function(err, result) {

    if(err) {
      logger.error(err);
    }

    return callback(result.rows);
  });

}
