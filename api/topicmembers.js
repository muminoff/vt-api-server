var getTopicMembersQuery = "select json_build_object('id', id, 'username', username, 'last_seen', (select (extract(epoch from last_seen) * 1000)::int8 from statuses where user_id=id)) as member, roles, profile, vt from users where id in (select user_id from subscribers where topic_id=$1)";

var topicMembers = module.exports = function(client, topic_id, logger, callback) {

  client.query(getTopicMembersQuery, [topic_id], function(err, result) {

    if(err) {
      logger.error(err);
    }

    return callback(result.rows);
  });

}
